import React from 'react';
import PropTypes from 'prop-types';
import { Container, Field, ClearButton } from './styles';

const SearchField = ({
	searchQuery,
	onSearch,
}) => (
	<Container>
		<Field
			type="text"
			value={searchQuery}
			placeholder="Search for documents, events, locations or participants"
			onChange={(evt) => onSearch(evt.target.value)}
		/>
		{searchQuery && (
			<ClearButton
				onClick={() => onSearch('')}
				spellCheck="false"
			>
				{'✕'}
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
