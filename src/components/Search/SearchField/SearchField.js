import React from 'react';
import PropTypes from 'prop-types';
import {
	Container, Field, ClearButton, Loup,
} from './styles';

const SearchField = ({
	searchQuery,
	onSearch,
}) => (
	<Container autocomplete="off" onSubmit={(evt) => evt.preventDefault()}>
		{!searchQuery && (
			<Loup>
				<img src="/icons/loup.svg" alt="Search" />
			</Loup>
		)}
		<Field
			type="search"
			name="searchfield"
			value={searchQuery}
			placeholder="Search for documents, events, locations or protagonists"
			onChange={(evt) => onSearch(evt.target.value)}
			id="search-bar"
			autocomplete="off"
		/>
		{searchQuery && (
			<ClearButton
				onClick={() => onSearch('')}
				spellCheck="false"
			>
				✕
			</ClearButton>
		)}
	</Container>
);

SearchField.propTypes = {
	searchQuery: PropTypes.string,
	onSearch: PropTypes.func,
};

SearchField.defaultProps = {
	searchQuery: '',
	onSearch: () => {},
};

export default SearchField;
