import React from 'react';
import PropTypes from 'prop-types';
import {
	Container,
	Content,
	Results,
	Result,
	ResultInfo,
	LoadingResult,
	TabsContainer,
	Tabs,
	Tab,
	TabHint,
	Key,
	Highlight,
	NoResults,
} from './styles';

const loadingResults = Object.keys([...Array(3)]);

const getFormattedTitle = (title, searchQuery) => {
	const titleLowercased = title.toLowerCase();
	const searchQueryLowercased = searchQuery.toLowerCase();
	let formattedTitle = title;

	const sqArray = searchQueryLowercased.split(' ');
	if (sqArray.length > 1) {
		const highlights = sqArray
			.map((sqPart) => {
				const index = titleLowercased.indexOf(sqPart);
				return {
					start: index,
					end: index + sqPart.length,
				};
			})
			.filter((highlight) => highlight.start >= 0);
		let cursor = 0;
		highlights.sort((a, b) => (a.start - b.start));
		formattedTitle = (
			<span>
				{highlights.map((highlight) => {
					const start = cursor;
					cursor = highlight.end;
					return (
						<>
							{title.substring(start, highlight.start)}
							<Highlight>{title.substring(highlight.start, highlight.end)}</Highlight>
						</>
					);
				})}
				{title.substring(cursor)}
			</span>
		);
	} else {
		const index = titleLowercased.indexOf(searchQueryLowercased);

		if (index >= 0) {
			formattedTitle = (
				<span>
					{title.substring(0, index)}
					<Highlight>{title.substring(index, index + searchQuery.length)}</Highlight>
					{title.substring(index + searchQuery.length)}
				</span>
			);
		}
	}
	return <span>{formattedTitle}</span>;
};

const SearchResults = ({
	searchQuery,
	isLoading,
	searchResults,
	tabs,
	activeTab,
	activeResult,
	setActiveResult,
	setActiveTab,
	onResultClick,
	counts,
}) => (
	<Container show={!!searchQuery}>
		<Content>
			<TabsContainer>
				<Tabs>
					{tabs.map(({ key, title }) => (
						<Tab
							key={key}
							className={activeTab === key && 'active'}
							onClick={() => setActiveTab(key)}
						>
							{`${title} (${counts[key]})`}
						</Tab>
					))}
				</Tabs>
				<TabHint>
					Hit tab
					<Key>⇥</Key>
					to switch category
				</TabHint>
			</TabsContainer>
			{searchResults.length === 0 && !isLoading ? (
				<NoResults>{`No results found for “${searchQuery}”.`}</NoResults>
			) : (
				<Results>
					{isLoading
						&& loadingResults.map((key) => <LoadingResult key={key}>&nbsp;</LoadingResult>)}
					{!isLoading
						&& searchResults.map(({ id, title, type }) => (
							<Result
								key={id}
								type={type}
								className={activeResult === id && 'highlighted'}
								onMouseEnter={() => setActiveResult(id)}
								onClick={() => onResultClick({ id, type })}
							>
								{getFormattedTitle(title, searchQuery)}
							</Result>
						))}
					{!isLoading && searchResults.length < counts[activeTab] && (
						<ResultInfo>{`Displaying first ${searchResults.length} results of ${counts[activeTab]}. Please refine your search to narrow results.`}</ResultInfo>
					)}
				</Results>
			)}
		</Content>
	</Container>
);

SearchResults.propTypes = {
	searchQuery: PropTypes.string,
	activeResult: PropTypes.string,
	isLoading: PropTypes.bool,
	setActiveResult: PropTypes.func,
	setActiveTab: PropTypes.func,
	onResultClick: PropTypes.func,
	searchResults: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			type: PropTypes.oneOf(['event', 'document', 'stakeholder', 'location']).isRequired,
		}),
	),
	activeTab: PropTypes.oneOf(['all', 'event', 'document', 'stakeholder', 'location']),
	tabs: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
		}),
	),
	counts: PropTypes.shape({
		event: PropTypes.number.isRequired,
		document: PropTypes.number.isRequired,
		stakeholder: PropTypes.number.isRequired,
	}),
};

SearchResults.defaultProps = {
	searchQuery: '',
	isLoading: true,
	searchResults: [],
	activeTab: 'all',
	activeResult: undefined,
	setActiveResult: () => {},
	setActiveTab: () => {},
	onResultClick: () => {},
	tabs: [
		{ key: 'all', title: 'All' },
		{ key: 'event', title: 'Events' },
		{ key: 'document', title: 'Documents' },
		{ key: 'stakeholder', title: 'Stakeholders' },
	],
	counts: {
		all: 0,
		event: 0,
		document: 0,
		stakeholder: 0,
	},
};

export default SearchResults;
