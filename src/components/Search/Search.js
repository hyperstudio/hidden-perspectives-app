import React from 'react';
import PropTypes from 'prop-types';
import SearchField from './SearchField';
import SearchResults from './SearchResults';
import { Container } from './styles';

const Search = (props) => (
	<Container>
		<SearchField {...props} />
		<SearchResults {...props} />
	</Container>
);

Search.propTypes = {
	searchQuery: PropTypes.string,
	onSearch: PropTypes.func,
	isLoading: PropTypes.bool,
	searchResults: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		type: PropTypes.oneOf(['event', 'document', 'stakeholder', 'location']).isRequired,
	})),
};

Search.defaultProps = {
	searchQuery: '',
	onSearch: () => {},
	isLoading: false,
	searchResults: [],
};

export default Search;
