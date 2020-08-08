import React from 'react';
import PropTypes from 'prop-types';
import {
	Container,
	Content,
	Results,
	Result,
	LoadingResult,
	Highlight,
	NoResults,
} from './styles';

const loadingResults = Object.keys([...Array(3)]);

const getFormattedTitle = (title, searchQuery) => {
	const titleLowercased = title.toLowerCase();
	const searchQueryLowercased = searchQuery.toLowerCase();
	const index = titleLowercased.indexOf(searchQueryLowercased);
	let formattedTitle = title;

	if (index >= 0) {
		formattedTitle = (
			<span>
				{title.substring(0, index)}
				<Highlight>{title.substring(index, index + searchQuery.length)}</Highlight>
				{title.substring(index + searchQuery.length)}
			</span>
		);
	}

	return <span>{formattedTitle}</span>;
};

const SearchInputResults = ({
	searchQuery,
	isLoading,
	searchResults,
	activeResult,
	setActiveResult,
	onResultClick,
}) => (
	<Container show={!!searchQuery}>
		<Content>
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
				</Results>
			)}
		</Content>
	</Container>
);

SearchInputResults.propTypes = {
	searchQuery: PropTypes.string,
	activeResult: PropTypes.string,
	isLoading: PropTypes.bool,
	setActiveResult: PropTypes.func,
	onResultClick: PropTypes.func,
	searchResults: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			type: PropTypes.oneOf(['event', 'document', 'stakeholder', 'location']).isRequired,
		}),
	),
	counts: PropTypes.shape({
		event: PropTypes.number.isRequired,
		document: PropTypes.number.isRequired,
		stakeholder: PropTypes.number.isRequired,
	}),
};

SearchInputResults.defaultProps = {
	searchQuery: '',
	isLoading: true,
	searchResults: [],
	activeResult: undefined,
	setActiveResult: () => {},
	onResultClick: () => {},
	counts: {
		all: 0,
		event: 0,
		document: 0,
		stakeholder: 0,
	},
};

export default SearchInputResults;
