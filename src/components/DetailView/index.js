import {
	compose,
	lifecycle,
	withState,
	withHandlers,
} from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { scaleLinear } from 'd3-scale';
import { withRouter } from 'react-router-dom';
import {
	map,
	prop,
	pipe,
	union,
	either,
	head,
	last,
} from 'ramda';
import DetailView from './DetailView';
import { withLoading, withErrors, getErrorHandler } from '../../utils/hocUtil';
import { ucFirst } from '../../utils/stringUtil';
import { formatHumanDate } from '../../utils/dateUtil';
import { groupItemsBy } from '../../utils/timelineUtil';
import { startTour } from '../../utils/localStorageUtil';
import reOrganizeItems from '../../utils/reorganizeUtil';

const EVENT_QUERY = gql`
query GetEvent($id: String) {
		event(where: { id: $id }) {
			id
			eventTitle
			eventStartDate
			eventTags {
        Tag {
					id
					name
				}
			}
			eventStakeholders {
        Stakeholder {
					id
					stakeholderFullName
        }
			}
			eventDescription
			eventLocations {
        Location {
					id
					locationName
				}
			}
		}
	}
`;

const DOCUMENT_QUERY = gql`
	query GetDocument($id: String) {
		document(where: { id: $id }) {
			id
			documentTitle
			documentCreationDate
			documentKind {
				Kind {
					id
					name
				}
			}
			documentTags {
				Tag {
					id
					name
				}
			}
			mentionedStakeholders {
				Stakeholder {
					id
					stakeholderFullName
				}
			}
			documentAuthors {
				Stakeholder {
					id
					stakeholderFullName
				}
			}
			documentDescription
			documentFiles {
				File {
					id
					url
				}
			}
			mentionedLocations {
				Location {
					id
					locationName
				}
			}
		}
	}
`;

const STAKEHOLDER_QUERY = gql`
	query GetStakeholder($id: String) {
		stakeholder(where: { id: $id }) {
			id
			stakeholderFullName
			stakeholderDescription
		}
	}
`;

const LOCATION_QUERY = gql`
	query GetLocation($id: String) {
		location(where: { id: $id }) {
			id
			locationName
			locationDescription
		}
	}
`;

const getQueryByItemId = (itemType) => {
	switch (itemType) {
	case 'event': return EVENT_QUERY;
	case 'document': return DOCUMENT_QUERY;
	case 'stakeholder': return STAKEHOLDER_QUERY;
	case 'location': return LOCATION_QUERY;
	default: return '';
	}
};

const formatTagsForQuery = (id, type, tagIds) => [
	...map(
		(tagId) => `{ ${type}Tags: { some: { Tag: { id: { equals: "${tagId}" } } } } }`,
		tagIds,
	),
	`{ id: { in: "${id}" } }`,
];

const getOrderBy = (type) => (
	type === 'document' ? '{ documentCreationDate: asc }' : '{ eventStartDate: asc }'
);

const getAdditionalReturnValuesByType = (type) => (
	type === 'document'
		? `
		documentCreationDate
		documentFiles {
			File {
				id
				url
			}
		}
		documentKind {
			Kind {
				id
				name
			}
		}
		documentAuthors {
			Stakeholder {
				id
				stakeholderFullName
			}
		}`
		: 'eventStartDate'
);

const builtQueryStringByType = (type, id, tagIds) => {
	const formattedTags = formatTagsForQuery(id, type, tagIds);
	const orderBy = getOrderBy(type);
	const additionalReturnValues = getAdditionalReturnValuesByType(type);
	const stakeholdersFieldName = type === 'document' ? 'mentionedStakeholders' : 'eventStakeholders';
	const query = `
		${type}s(
			where: {
				OR: [
					${formattedTags}
				]
			}
			orderBy: ${orderBy}
		) {
			id
			${type}Title
			${additionalReturnValues}
			${type}Tags {
				Tag {
					id
					name
				}
			}
			${type}Description
			${stakeholdersFieldName} {
				Stakeholder {
					id
					stakeholderFullName
				}
			}
		}
	`;
	return query;
};

const builtTagsQuery = (id, tagIds) => gql`
	query {
		${builtQueryStringByType('event', id, tagIds)}
		${builtQueryStringByType('document', id, tagIds)}
	}
`;

const builtStakeholderQueryStringByItemId = (type, { id }) => {
	const orderBy = getOrderBy(type);
	const additionalReturnValues = getAdditionalReturnValuesByType(type);
	const stakeholdersFieldName = type === 'document' ? 'mentionedStakeholders' : 'eventStakeholders';
	const query = `
		${type}s(
			where: {
				${stakeholdersFieldName}: {
					some: { 
						Stakeholder: { id: { equals: "${id}" } }
					}
				}
			}
			orderBy: ${orderBy}
		) {
			id
			${type}Title
			${additionalReturnValues}
			${type}Tags {
				Tag {
					id
					name
				}
			}
			${type}Description
			${stakeholdersFieldName} {
				Stakeholder { 
					id
					stakeholderFullName
				}
			}
		}
	`;
	return query;
};

const builtLocationQueryStringByItemId = (type, { id }) => {
	const orderBy = getOrderBy(type);
	const additionalReturnValues = getAdditionalReturnValuesByType(type);
	const locationsFieldName = type === 'document' ? 'mentionedLocations' : 'eventLocations';
	const query = `
		${type}s(
			where: {
				${locationsFieldName}: {
					some: { Location: { id: { equals: "${id}" } } }
				}
			}
			orderBy: ${orderBy}
		) {
			id
			${type}Title
			${additionalReturnValues}
			${type}Tags {
				Tag {
					id
					name
				}
			}
			${type}Description
			${locationsFieldName} {
				Location {
					id
					locationName
				}
			}
		}
	`;
	return query;
};

const builtStakeholderMentionedInQuery = (item) => gql`
	query {
		${builtStakeholderQueryStringByItemId('event', item)}
		${builtStakeholderQueryStringByItemId('document', item)}
	}
`;

const builtLocationMentionedInQuery = (item) => gql`
	query {
		${builtLocationQueryStringByItemId('event', item)}
		${builtLocationQueryStringByItemId('document', item)}
	}
`;

const getResponseProp = (key, type, item) => {
	switch (type) {
	case 'event':
	case 'document': return prop(`${type}${ucFirst(key)}`, item);
	case 'stakeholder': return item.stakeholderFullName;
	case 'location': return item.locationName;
	default: return '';
	}
};

const getItemSubtitle = (item, itemType) => {
	switch (itemType) {
	case 'event': return `Event ・ ${formatHumanDate(new Date(item.eventStartDate))}`;
	case 'document': return `${ucFirst(item.documentKind[0].Kind && item.documentKind[0].Kind.name)} ・ ${formatHumanDate(new Date(item.documentCreationDate))}`;
	case 'stakeholder': return 'Protagonist';
	case 'location': return 'Location';
	default: return '';
	}
};

const getItemDescription = (item, itemType) => item[`${itemType}Description`];

const getItemOriginal = (item, itemType) => {
	if (itemType !== 'document') return undefined;
	return item.documentFiles && item.documentFiles.length > 0
		? item.documentFiles[0].File.url : undefined;
};

const getItemAuthors = (item, itemType) => {
	if (itemType !== 'document') return [];
	return item.documentAuthors.map((author) => ({
		id: author.Stakeholder.id,
		name: author.Stakeholder.stakeholderFullName,
	}));
};

const mapLocation = ({ Location: { id, locationName: name } }) => ({ id, name });
const getItemLocations = (item, itemType) => {
	if (itemType === 'document') return item.mentionedLocations.map(mapLocation);
	if (itemType === 'event') return item.eventLocations.map(mapLocation);
	return [];
};

const getQuery = (item, itemType) => {
	let query;
	let tags = [];

	if (itemType === 'event' || itemType === 'document') {
		tags = getResponseProp('tags', itemType, item);
		const tagsQuery = builtTagsQuery(item.id, map(prop('id'), reOrganizeItems(tags, 'tag')));
		query = tagsQuery;
	} else if (itemType === 'stakeholder') {
		const mentionedInQuery = builtStakeholderMentionedInQuery(item);
		query = mentionedInQuery;
	} else if (itemType === 'location') {
		const mentionedInQuery = builtLocationMentionedInQuery(item);
		query = mentionedInQuery;
	}

	return { query, tags };
};

const getProtagonists = (item, itemType, allDocuments, allEvents) => {
	const items = itemType === 'stakeholder' || itemType === 'location' ? union(allDocuments, allEvents) : [item];
	const protagonists = items.reduce((allProtagonists, currentItem) => {
		const stakeholdersValue = either(prop('eventStakeholders'), prop('mentionedStakeholders'))(currentItem) || [];
		const stakeholders = stakeholdersValue.reduce((acc, current) => ({
			...acc,
			[current.Stakeholder.id]: (acc[current.Stakeholder.id] || []).concat(current),
		}), allProtagonists);
		return {
			...allProtagonists,
			...stakeholders,
		};
	}, {});

	return protagonists;
};

const getItemDate = pipe(either(prop('documentCreationDate'), prop('eventStartDate')), (x) => new Date(x));
const getItemTags = either(prop('documentTags'), prop('eventTags'));

const newNormalizeItem = ({ tags, getAngle }) => (item) => {
	const itemTags = getItemTags(item);
	const commonTags = itemTags.filter(
		(itemTag) => tags.some(({ Tag: { id } }) => id === itemTag.Tag.id),
	);
	const date = getItemDate(item);
	return {
		...item,
		angle: getAngle(date),
		tags: itemTags,
		date,
		commonTags,
	};
};

const newNormalizeItems = ({ tags, getAngle, items }) => pipe(
	map(newNormalizeItem({ tags, getAngle })),
	(x) => groupItemsBy(x, 'angle'),
)(items);

const roundAngle = (angle) => angle - (angle % 4);

const getFirstDate = pipe(head, getItemDate);
const getLastDate = pipe(last, getItemDate);

const getStartExtreme = ({ documents, events }) => {
	const firstDocumentDate = getFirstDate(documents);
	const firstEventDate = getFirstDate(events);

	return firstDocumentDate < firstEventDate ? firstDocumentDate : firstEventDate;
};

const getEndExtreme = ({ documents, events }) => {
	const lastDocumentDate = getLastDate(documents);
	const lastEventDate = getLastDate(events);

	return lastDocumentDate > lastEventDate ? lastDocumentDate : lastEventDate;
};

const newParseItems = ({ documents, events, tags }) => {
	const dateExtremes = [
		getStartExtreme({ documents, events }),
		getEndExtreme({ documents, events }),
	];
	const angleScaleFunction = scaleLinear()
		.domain(dateExtremes)
		.range([0, 320]);

	const getAngle = pipe(angleScaleFunction, roundAngle);
	return {
		newEvents: newNormalizeItems({ tags, getAngle, items: events }),
		newDocuments: newNormalizeItems({ tags, getAngle, items: documents }),
	};
};

const getContextParser = (props, item, tags) => ({ data: { events, documents } }) => {
	const {
		itemType,
		stopLoading,
		setDocuments,
		setEvents,
		setProtagonists,
		setItemCounts,
		setTourIsOpen,
		setHoveredElement,
	} = props;

	if (documents.length === 0 && events.length === 0) {
		setDocuments([]);
		setEvents([]);
		stopLoading();
		return;
	}

	const { newDocuments, newEvents } = newParseItems({ documents, events, tags });
	const protagonists = getProtagonists(item, itemType, documents, events);

	setItemCounts({
		documentsCount: documents.length,
		eventsCount: events.length,
		protagonistsCount: protagonists.length,
	});
	setDocuments(newDocuments);
	setEvents(newEvents);
	setProtagonists(protagonists);

	stopLoading();
	setHoveredElement(null);
	startTour('circle-timeline', setTourIsOpen);
};

const getItemParser = (props) => ({ data }) => {
	const {
		client,
		setItem,
		itemType,
		setTags,
	} = props;
	const dataItemName = itemType;
	const item = data[dataItemName];

	setItem({
		id: item.id,
		date: either(prop('eventStartDate'), prop('documentPublicationDate'))(item),
		title: getResponseProp('title', itemType, item),
		subtitle: getItemSubtitle(item, itemType),
		description: getItemDescription(item, itemType),
		original: getItemOriginal(item, itemType),
		authors: getItemAuthors(item, itemType),
		locations: getItemLocations(item, itemType),
		itemType,
	});

	const { query, tags } = getQuery(item, itemType);
	client.query({ query })
		.then(getContextParser(props, item, tags))
		.catch(getErrorHandler(props));
	setTags(tags);
};

const performQuery = (props) => {
	const {
		id,
		client,
		itemType,
		startLoading,
	} = props;
	startLoading();
	client.query({
		query: getQueryByItemId(itemType),
		variables: { id },
	})
		.then(getItemParser(props))
		.catch(getErrorHandler(props));
};

export default compose(
	withApollo,
	withLoading,
	withErrors,
	withRouter,
	withState('item', 'setItem', undefined),
	withState('documents', 'setDocuments', []),
	withState('events', 'setEvents', []),
	withState('protagonists', 'setProtagonists', {}),
	withState('itemCounts', 'setItemCounts', { eventsCount: 0, documentsCount: 0, protagonistsCount: 0 }),
	withState('hoveredElement', 'setHoveredElement', null),
	withState('tags', 'setTags', []),
	withState('filteredTags', 'setFilteredTags', []),
	withState('tourIsOpen', 'setTourIsOpen', false),
	withHandlers({
		onTourClose: ({ setTourIsOpen }) => () => setTourIsOpen(false),
	}),
	lifecycle({
		componentDidMount() {
			performQuery(this.props);
		},
		shouldComponentUpdate(nextProps) {
			const { id } = this.props;
			if (nextProps.id !== id) {
				performQuery(nextProps);
			}
			return (
				this.props.item !== nextProps.item
				|| this.props.documents !== nextProps.documents
				|| this.props.events !== nextProps.events
				|| this.props.protagonists !== nextProps.protagonists
				|| this.props.hoveredElement !== nextProps.hoveredElement
				|| this.props.isLoading !== nextProps.isLoading
				|| this.props.itemType !== nextProps.itemType
				|| this.props.errors !== nextProps.errors
				|| this.props.tags !== nextProps.tags
				|| this.props.tourIsOpen !== nextProps.tourIsOpen
				|| this.props.filteredTags !== nextProps.filteredTags
			);
		},
	}),
)(DetailView);
