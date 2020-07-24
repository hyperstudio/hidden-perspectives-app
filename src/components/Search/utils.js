import gql from 'graphql-tag';
import {
	sortBy,
	prop,
	propEq,
	findIndex,
} from 'ramda';
import {
	compose,
	withState,
	withHandlers,
	mapProps,
} from '@hypnosphi/recompose';
import { withRouter } from 'react-router-dom';
import { withLoading, withErrors } from '../../utils/hocUtil';

export const getSearchQuery = (limit) => {
	const getEventsQuery = (suffix = '') => `events${suffix}(
		where: {
			OR: [
				{ eventTitle: { contains: $searchQuery } }
				{ eventDescription: { contains: $searchQuery } }
				{ eventStakeholders: { 
						some: {
							Stakeholder: {
								stakeholderFullName: {
									contains: $searchQuery
								}
							}
						}
					} 
				}
			]
		}
		${limit ? `first: ${limit}` : ''}
	)`;
	const getDocumentsQuery = (suffix = '') => `documents${suffix}(
		where: {
			OR: [
				{ documentTitle: { contains: $searchQuery } }
				{ documentDescription: { contains: $searchQuery } }
				{ documentTranscript: { contains: $searchQuery } }
				{ mentionedStakeholders: { 
						some: {
							Stakeholder: {
								stakeholderFullName: {
									contains: $searchQuery
								}
							}
						}
					}
				}
			]
		}
		${limit ? `first: ${limit}` : ''}
	)`;
	const getStakeholderQuery = (suffix = '') => `stakeholders${suffix}(
		where: {
			OR: [
				{ stakeholderFullName: { 
						contains: $searchQuery
					} 
				}
				{ stakeholderDescription: {
						contains: $searchQuery 
					}
				}
			]
		}
		${limit ? `first: ${limit}` : ''}
	)`;

	return gql`
		query Search($searchQuery: String!) {
			${getEventsQuery()} {
				id
				eventTitle
				eventCount
			}
			${getDocumentsQuery()} {
				id
				documentTitle
				documentCount
			}
			${getStakeholderQuery()} {
				id
				stakeholderFullName
				stakeholderCount
			}
		}
	`;
};

const getElementParser = (type, titleKey) => (items) => items.map((item) => ({
	id: item.id,
	title: item[titleKey],
	type,
}));

const parseDocuments = getElementParser('document', 'documentTitle');
const parseEvents = getElementParser('event', 'eventTitle');
const parseStakeholders = getElementParser('stakeholder', 'stakeholderFullName');
const contains = (container, containment) => container.toLowerCase()
	.includes(containment.toLowerCase());

export const handleSearchResults = (props, value) => ({ data }) => {
	const { stopLoading, setCounts, setSearchResults } = props;
	const documents = parseDocuments(data.documents);
	const events = parseEvents(data.events);
	const stakeholders = parseStakeholders(data.stakeholders);
	const unorderedSearchResults = [...stakeholders, ...documents, ...events];
	const allSearchResults = sortBy(prop('title'), unorderedSearchResults);
	const withHighlights = allSearchResults.filter(({ title }) => contains(title, value));
	const withoutHighlights = allSearchResults.filter(({ title }) => !contains(title, value));
	const searchResults = [...withHighlights, ...withoutHighlights];
	const documentCount = data.documents[0] ? data.documents[0].documentCount : 0;
	const eventCount = data.events[0] ? data.events[0].eventCount : 0;
	const stakeholderCount = data.stakeholders[0] ? data.stakeholders[0].stakeholderCount : 0;

	stopLoading();
	setSearchResults(searchResults);
	setCounts({
		all: eventCount
			+ documentCount
			+ stakeholderCount,
		event: eventCount,
		document: documentCount,
		stakeholder: stakeholderCount,
	});
};

export const withSearch = compose(
	withLoading,
	withErrors,
	withRouter,
	withState('searchQuery', 'setSearchQuery', ''),
	withState('allSearchResults', 'setSearchResults', []),
	withState('activeTab', 'setActiveTab', 'all'),
	withState('activeResult', 'setActiveResult', undefined),
	withState('counts', 'setCounts', undefined),
	mapProps((props) => {
		const searchResults = props.activeTab === 'all'
			? props.allSearchResults
			: props.allSearchResults.filter(propEq('type', props.activeTab));
		return {
			...props,
			searchResults,
			tabs: [
				{ key: 'all', title: 'All' },
				{ key: 'event', title: 'Events' },
				{ key: 'document', title: 'Documents' },
				{ key: 'stakeholder', title: 'Protagonists' },
			],
		};
	}),
	withHandlers({
		onResultClick: ({ setSearchQuery, history }) => ({ id, type }) => {
			setSearchQuery('');
			const itemType = type === 'stakeholder' ? 'protagonist' : type;
			history.push(`/${itemType}/context/${id}`);
		},
		onTab: (props) => (evt) => {
			evt.preventDefault();
			const {
				activeTab,
				setActiveTab,
				tabs,
			} = props;
			const indexOfCurrent = findIndex(propEq('key', activeTab), tabs);
			const newIndex = indexOfCurrent + 1;
			if (newIndex > (tabs.length - 1)) {
				setActiveTab(tabs[0].key);
				return;
			}
			const newTab = tabs[newIndex].key;
			setActiveTab(newTab);
		},
		onArrow: (props) => (evt) => {
			evt.preventDefault();
			const { activeResult, setActiveResult, searchResults } = props;
			const indexOfCurrent = findIndex(propEq('id', activeResult), searchResults);
			const newIndex = indexOfCurrent + (evt.code === 'ArrowDown' ? 1 : -1);
			if (searchResults.length && (newIndex > (searchResults.length - 1) || !activeResult)) {
				setActiveResult(searchResults[0].id);
				return;
			}
			if (searchResults.length && (newIndex < 0 || !activeResult)) {
				setActiveResult(searchResults[searchResults.length - 1].id);
				return;
			}
			setActiveResult(searchResults[newIndex].id);
		},
		onEnter: ({ searchQuery, setSearchQuery, ...props }) => (evt) => {
			evt.preventDefault();
			setSearchQuery('');
			const { history, searchResults, activeResult } = props;
			const activeResultObj = searchResults.find(propEq('id', activeResult));
			if (!activeResultObj) {
				if (searchQuery) {
					history.push(`/search/${encodeURIComponent(searchQuery)}`);
				}
				return;
			}
			const { id, type } = activeResultObj;
			const itemType = type === 'stakeholder' ? 'protagonist' : type;
			history.push(`/${itemType}/context/${id}`);
		},
		onEscape: (props) => (evt) => {
			evt.preventDefault();
			const { setSearchQuery } = props;
			setSearchQuery('');
		},
	}),
);
