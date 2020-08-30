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
		${(limit && suffix !== 'Count') ? `first: ${limit}` : ''}
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
		${(limit && suffix !== 'Count') ? `first: ${limit}` : ''}
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
		${(limit && suffix !== 'Count') ? `first: ${limit}` : ''}
	)`;
	const getTagQuery = (suffix = '') => `tags${suffix}(
		where: {
			OR: [
				{ name: { 
						contains: $searchQuery
					} 
				}
				{ description: {
						contains: $searchQuery 
					}
				}
			]
		}
		${(limit && suffix !== 'Count') ? `first: ${limit}` : ''}
	)`;

	return gql`
		query Search($searchQuery: String!) {
			${getEventsQuery()} {
				id
				eventTitle
			}
			${getDocumentsQuery()} {
				id
				documentTitle
			}
			${getStakeholderQuery()} {
				id
				stakeholderFullName
			}
			${getTagQuery()} {
				id
				name
			}
			${getEventsQuery('Count')}
			${getDocumentsQuery('Count')}
			${getStakeholderQuery('Count')}
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
const parseTags = getElementParser('tag', 'name');
const contains = (container, containment) => container.toLowerCase()
	.includes(containment.toLowerCase());

export const handleSearchResults = (props, value) => ({ data }) => {
	const { stopLoading, setCounts, setSearchResults } = props;
	const documents = parseDocuments(data.documents);
	const events = parseEvents(data.events);
	const stakeholders = parseStakeholders(data.stakeholders);
	const tags = parseTags(data.tags);
	const unorderedSearchResults = [...stakeholders, ...documents, ...events, ...tags];
	const allSearchResults = sortBy(prop('title'), unorderedSearchResults);
	const withHighlights = allSearchResults.filter(({ title }) => contains(title, value));
	const withoutHighlights = allSearchResults.filter(({ title }) => !contains(title, value));
	const searchResults = [...withHighlights, ...withoutHighlights];
	const documentCount = data.documentsCount;
	const eventCount = data.eventsCount;
	const stakeholderCount = data.stakeholdersCount;

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
		const searchResults = props.allSearchResults.filter(propEq('type', props.type));
		return {
			...props,
			searchResults,
		};
	}),
	withHandlers({
		onResultClick: ({
			setSearchQuery, push, setSpecialInputState, specialInputState, name,
		}) => ({ title, id }) => {
			setSearchQuery('');
			push(`${name}s`, { id, name: title });
			setSpecialInputState(
				{ ...specialInputState, addingTag: '', tagInputState: '' },
			);
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
			const { searchResults, activeResult, name } = props;
			const activeResultObj = searchResults.find(propEq('id', activeResult));
			if (!activeResultObj) {
				if (searchQuery) {
					setSearchQuery(searchQuery);
					if (props.type === 'tag') {
						const title = searchQuery;
						props.push(`${name}s`, { name: title, value: title });
						props.setSpecialInputState(
							{ ...props.specialInputState, addingTag: '', tagInputState: '' },
						);
					}
				}
			} else {
				const { title, id } = activeResultObj;
				props.push(`${name}s`, { id, name: title });
				props.setSpecialInputState(
					{ ...props.specialInputState, addingTag: '', tagInputState: '' },
				);
			}
		},
		onEscape: (props) => (evt) => {
			evt.preventDefault();
			const { setSearchQuery } = props;
			setSearchQuery('');
		},
	}),
);
