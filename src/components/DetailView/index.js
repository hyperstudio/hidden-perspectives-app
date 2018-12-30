import {
	compose,
	lifecycle,
	withState,
} from 'recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { scaleLinear } from 'd3-scale';
import { map, prop, pipe } from 'ramda';
import DetailView from './DetailView';
import { withLoading, withErrors, getErrorHandler } from '../../utils/hocUtil';
import { ucFirst } from '../../utils/stringUtil';
import { getFormattedDate } from '../../utils/dateUtil';
import { groupItemsBy } from '../../utils/timelineUtil';

const EVENT_QUERY = gql`
	query GetEvent($id: ID!) {
		Event(id: $id) {
			id
			eventTitle
			eventStartDate
			eventTags {
				id
				name
			}
		}
	}
`;

const DOCUMENT_QUERY = gql`
	query GetDocument($id: ID!) {
		Document(id: $id) {
			id
			documentTitle
			documentKind {
				id
				name
			}
			documentTags {
				id
				name
			}
		}
	}
`;

const GET_DOCUMENT_STAKEHOLDERS = gql`
	query GetDocumentProtagonists($id: ID!) {
		Document(id: $id) {
			id
			mentionedStakeholders {
				id
				stakeholderFullName
			}
		}
	}
`;

const GET_EVENT_STAKEHOLDERS = gql`
	query GetEventProtagonists($id: ID!) {
		Event(id: $id) {
			id
			eventStakeholders {
				id
				stakeholderFullName
			}
		}
	}
`;

// Protagonists
// TODO: Combine with the rest of the component logic
const handleProtagonists = (props, documents, events) => {
	const getClusteredProtagonists = (data) => data
		.map((d) => {
			const { Document, Event } = d.data;
			return Document ? Document.mentionedStakeholders : Event.eventStakeholders;
		})
		.reduce((acc, current) => {
			const flattenedProtagonists = acc.concat(current);
			return flattenedProtagonists;
		}, [])
		.reduce((acc, current) => Object.assign(acc, {
			[current.id]: (acc[current.id] || []).concat(current),
		}), {});

	const isDocumentID = (fileId) => fileId.startsWith('uir');
	const fetchProtagonistsByID = (fileId) => props.client.query({
		query: isDocumentID(fileId) ? GET_DOCUMENT_STAKEHOLDERS : GET_EVENT_STAKEHOLDERS,
		variables: { id: fileId },
	});

	const itemIDs = [...documents, ...events].map((items) => items.map((item) => item.id));
	const flattenedIDs = [].concat(...itemIDs);

	const protagonistPromises = flattenedIDs.map(
		(eventID) => fetchProtagonistsByID(eventID),
	);

	Promise.all(protagonistPromises)
		.then((response) => {
			const clusteredProtagonists = getClusteredProtagonists(response);
			props.setProtagonists(clusteredProtagonists);
		})
		.catch(getErrorHandler(props));
};

const formatTagsForQuery = (type, tagIds) => map(
	(tagId) => `{ ${type}Tags_some: { id: "${tagId}" } }`,
	tagIds,
);

const getOrderBy = (type) => (
	type === 'document' ? 'documentCreationDate_ASC' : 'eventStartDate_ASC'
);

const getAdditionalReturnValuesByType = (type) => (
	type === 'document' ? `documentCreationDate
	documentKind { id, name }` : 'eventStartDate'
);

const builtQueryStringByType = (type, tagIds) => {
	const formattedTags = formatTagsForQuery(type, tagIds);
	const orderBy = getOrderBy(type);
	const additionalReturnValues = getAdditionalReturnValuesByType(type);
	const query = `
		all${ucFirst(type)}s(
			filter: {
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
				id
				name
			}
			${type}Description
		}
	`;
	return query;
};

const buildTagsQuery = (tagIds) => gql`
	query {
		${builtQueryStringByType('event', tagIds)}
		${builtQueryStringByType('document', tagIds)}
	}
`;

const getContextParser = (props) => ({ data: { allEvents, allDocuments } }) => {
	const { stopLoading, setDocuments, setEvents } = props;
	const dateExtremes = [
		new Date(allDocuments[0].documentCreationDate),
		new Date(allDocuments[allDocuments.length - 1].documentCreationDate),
	];
	const angleScaleFunction = scaleLinear()
		.domain(dateExtremes)
		.range([0, 320]);

	const roundAngle = (angle) => angle - (angle % 4);
	const getAngle = pipe(angleScaleFunction, roundAngle);
	const parsedDocuments = pipe(
		map((document) => {
			const { id, documentCreationDate } = document;
			const date = new Date(documentCreationDate);
			const angle = getAngle(date);
			return {
				...document,
				id,
				date,
				angle,
			};
		}),
		(items) => groupItemsBy(items, 'angle'),
	)(allDocuments);

	const parsedEvents = pipe(
		map((event) => {
			const { id, eventStartDate } = event;
			const date = new Date(eventStartDate);
			const angle = getAngle(date);
			return {
				...event,
				id,
				date,
				angle,
			};
		}),
		(items) => groupItemsBy(items, 'angle'),
	)(allEvents);

	setDocuments(parsedDocuments);
	setEvents(parsedEvents);
	handleProtagonists(props, parsedDocuments, parsedEvents);
	stopLoading();
};

const getResponseProp = (key, type, item) => prop(`${type}${ucFirst(key)}`, item);

const getItemParser = (props) => ({ data }) => {
	const { client, setItem, itemType } = props;
	const dataItemName = ucFirst(itemType);
	const item = data[dataItemName];

	setItem({
		id: item.id,
		title: getResponseProp('title', itemType, item),
		subtitle: itemType === 'document'
			? item.documentKind && item.documentKind.name
			: getFormattedDate(new Date(item.eventStartDate)),
		itemType,
	});

	const tags = getResponseProp('tags', itemType, item);
	const tagsQuery = buildTagsQuery(map(prop('id'), tags));
	client.query({
		query: tagsQuery,
	})
		.then(getContextParser(props))
		.catch(getErrorHandler(props));
};

export default compose(
	withApollo,
	withLoading,
	withErrors,
	withState('item', 'setItem', undefined),
	withState('documents', 'setDocuments', []),
	withState('events', 'setEvents', []),
	withState('protagonists', 'setProtagonists', {}),
	lifecycle({
		componentDidMount() {
			const { id, client, itemType } = this.props;
			client.query({
				query: itemType === 'event' ? EVENT_QUERY : DOCUMENT_QUERY,
				variables: { id },
			})
				.then(getItemParser(this.props))
				.catch(getErrorHandler(this.props));
		},
	}),
)(DetailView);
