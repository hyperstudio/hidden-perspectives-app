import { withApollo } from 'react-apollo';
import {
	compose, lifecycle, withState, withHandlers,
} from '@hypnosphi/recompose';
import gql from 'graphql-tag';
import {
	map, groupBy, union, either, prop, flatten, reduce, merge,
} from 'ramda';
import debounce from 'lodash.debounce';
import { withRouter } from 'react-router-dom';
import MainTimeline from './MainTimeline';
import {
	withLoading, withErrors, withAlerts, getErrorHandler,
} from '../../utils/hocUtil';
import { getMinimap, isFullyInViewport } from '../../utils/timelineUtil';
import isDocumentId from '../../utils/isDocumentId';
import { getFormattedDate } from '../../utils/dateUtil';
import { parseItemsToDates } from './utils';
import { startTour } from '../../utils/localStorageUtil';

const ALL_EVENTS_AND_DOCUMENTS = gql`
	query {
		events(orderBy: { eventStartDate: asc }) {
			id
			eventTitle
			eventStartDate
			eventDescription
			eventStakeholders {
				Stakeholder{
					id
					stakeholderFullName
				}
			}
		}
		documents(orderBy: { documentCreationDate: asc} ) {
			id
			documentTitle
			documentDescription
			documentCreationDate
			mentionedStakeholders {
				Stakeholder{
					id
					stakeholderFullName
				}
			}
			documentAuthors {
				Stakeholder{
					id
					stakeholderFullName
				}
			}
		}
	}
`;

const getFilterArgsForQuery = (type, itemIds) => map((id) => `{ id: { equals: "${id}" } }`, itemIds);

const builtProtagonistQueryStringByType = (type, itemIds) => {
	const stakeholdersFieldName = type === 'document' ? 'mentionedStakeholders' : 'eventStakeholders';
	const query = `
		${type}s(
			where: {
				OR: [
					${getFilterArgsForQuery(type, itemIds)}
				]
			}
		) {
			id
			${type}Title
			${stakeholdersFieldName} {
				Stakeholder{
					id
					stakeholderFullName
				}
			}
		}
	`;
	return query;
};

const protagonistQueries = (groupedItemIds) => Object.keys(groupedItemIds)
	.map((key) => builtProtagonistQueryStringByType(key, groupedItemIds[key]));

const builtProtagonistQuery = (itemIds) => gql`
	query {
		${protagonistQueries(itemIds)}
	}
`;

const normaliseItems = ({
	items, itemDateProperty, itemTitleProperty, itemType,
}) => items.map((props) => {
	const date = new Date(props[itemDateProperty]);
	const { id } = props;
	return {
		...props,
		id,
		date,
		dateString: getFormattedDate(date),
		title: props[itemTitleProperty],
		path: `/${itemType}/context/${id.trim()}`,
		type: itemType,
	};
});

const structureItems = ({ timelineEvents, timelineDocuments }) => {
	const nodes = [...timelineEvents, ...timelineDocuments].sort((a, b) => {
		const dateA = Date.parse(a.dateString);
		const dateB = Date.parse(b.dateString);

		if (dateA > dateB) return 1;
		if (dateA < dateB) return -1;
		return 0;
	});

	const firstYear = parseInt(nodes[0].dateString.split('-')[0], 10);
	return parseItemsToDates(firstYear, nodes);
};

const getClusteredProtagonists = ({ data: { events, documents } }) => {
	const combinedEventsAndDocuments = union(events, documents);
	const protagonists = map(
		either(prop('mentionedStakeholders'), prop('eventStakeholders')),
		combinedEventsAndDocuments,
	);

	return reduce(
		(acc, current) => merge(acc, {
			[current.Stakeholder.id]: (acc[current.Stakeholder.id] || []).concat(current),
		}),
		{},
		flatten(protagonists),
	);
};

const parseItems = ({ events, datesArray, documents }) => {
	const timelineEvents = normaliseItems({
		items: events,
		itemDateProperty: 'eventStartDate',
		itemTitleProperty: 'eventTitle',
		itemType: 'event',
	});

	const timelineDocuments = normaliseItems({
		items: documents,
		itemDateProperty: 'documentCreationDate',
		itemTitleProperty: 'documentTitle',
		itemType: 'document',
	});

	return structureItems({
		datesArray,
		timelineEvents,
		timelineDocuments,
	});
};

const getEventsAndDocuments = ({
	setTimelineItems,
	stopLoading,
	setMinimapItems,
	setDocumentsCount,
	setEventsCount,
	setTourIsOpen,
	setAlerts,
	history,
}) => ({ data: { events, documents } }) => {
	const items = parseItems({
		events,
		documents,
		datesArray: [
			new Date(documents[0].documentCreationDate),
			new Date(documents[documents.length - 1].documentCreationDate),
		],
	});


	if (history.location.state && history.location.state.alerts) {
		setAlerts(history.location.state.alerts);
	}
	setTimelineItems(items);
	setMinimapItems(getMinimap(items));
	setDocumentsCount(documents.length);
	setEventsCount(events.length);
	stopLoading();
	startTour('main-timeline', setTourIsOpen);
};

const getEventIdsInViewport = (timelineElement) => {
	const timelineEvents = timelineElement.getElementsByClassName('timeline-event');
	const eventIds = [...timelineEvents]
		.filter(isFullyInViewport)
		.map((timelineEvent) => timelineEvent.getAttribute('data-id'));

	return eventIds;
};

const getProtagonistsInViewport = (timelineElement, props) => {
	const {
		setBubbleChartItems,
		setFetchingProtagonists,
		setProtagonistsCount,
	} = props;

	const timelineEventIds = getEventIdsInViewport(timelineElement);

	if (timelineEventIds.length > 0) {
		const groupById = groupBy((id) => (isDocumentId(id) ? 'document' : 'event'));
		const groupedItemIds = groupById(timelineEventIds);

		setFetchingProtagonists(true);

		props.client
			.query({
				query: builtProtagonistQuery(groupedItemIds),
			})
			.then((response) => {
				const clusteredProtagonists = getClusteredProtagonists(response);
				setProtagonistsCount(Object.keys(clusteredProtagonists).length);
				setBubbleChartItems(clusteredProtagonists);
				setFetchingProtagonists(false);
			})
			.catch(getErrorHandler(props));
	} else {
		setBubbleChartItems({});
	}
};

const onTimelineScroll = (props) => debounce(
	(target) => {
		if (!target) return;
		getProtagonistsInViewport(target, props);
	},
	150,
);

const onCloseTour = ({ setTourIsOpen }) => () => {
	setTourIsOpen(false);
};

const DEFAULT_SCROLL_ROW = 267;

const getDefaultActiveRowIndex = () => {
	const { lastScrolledRow } = window;
	if (lastScrolledRow && lastScrolledRow !== DEFAULT_SCROLL_ROW) return lastScrolledRow;
	return DEFAULT_SCROLL_ROW;
};

export default compose(
	withApollo,
	withLoading,
	withErrors,
	withAlerts,
	withRouter,
	withState('timelineItems', 'setTimelineItems', []),
	withState('eventsCount', 'setEventsCount', 0),
	withState('documentsCount', 'setDocumentsCount', 0),
	withState('protagonistsCount', 'setProtagonistsCount', 0),
	withState('minimapItems', 'setMinimapItems', []),
	withState('bubbleChartItems', 'setBubbleChartItems', {}),
	withState('timelineContainer', 'setTimelineContainer', null),
	withState('fetchingProtagonists', 'setFetchingProtagonists', true),
	withState('initialProtagonistsFetched', 'setInitialProtagonistsFetched', false),
	withState('hoveredElement', 'setHoveredElement', null),
	withState('activeRowIndex', 'setActiveRowIndex', getDefaultActiveRowIndex),
	withState('activeYear', 'setActiveYear', '1993'),
	withState('tourIsOpen', 'setTourIsOpen', false),
	withHandlers({
		onTimelineScroll,
		onCloseTour,
	}),
	lifecycle({
		componentDidMount() {
			const { props } = this;

			props.client
				.query({ query: ALL_EVENTS_AND_DOCUMENTS })
				.then(getEventsAndDocuments(props))
				.catch(getErrorHandler(props));
		},
		shouldComponentUpdate(nextProps) {
			return (nextProps.timelineItems.length !== this.props.timelineItems.length)
				|| (nextProps.bubbleChartItems !== this.props.bubbleChartItems)
				|| (nextProps.fetchingProtagonists !== this.props.fetchingProtagonists)
				|| (nextProps.errors.length !== this.props.errors.length)
				|| (nextProps.alerts.length !== this.props.alerts.length)
				|| (nextProps.isLoading !== this.props.isLoading)
				|| (nextProps.hoveredElement !== this.props.hoveredElement)
				|| (nextProps.eventsCount !== this.props.eventsCount)
				|| (nextProps.documentsCount !== this.props.documentsCount)
				|| (nextProps.protagonistsCount !== this.props.protagonistsCount)
				|| (nextProps.activeRowIndex !== this.props.activeRowIndex)
				|| (nextProps.activeYear !== this.props.activeYear)
				|| (nextProps.tourIsOpen !== this.props.tourIsOpen)
				|| (nextProps.activeRowIndex !== this.props.activeRowIndex)
				|| (nextProps.hoveredElement !== this.props.hoveredElement);
		},
	}),
)(MainTimeline);
