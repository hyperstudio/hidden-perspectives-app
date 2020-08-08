import React from 'react';
import PropTypes from 'prop-types';
import SearchInputField from './SearchInputField';
import SearchInputResults from './SearchInputResults';
import Errors from '../Errors';
import { Container } from './styles';

const SearchInput = (props) => (
	<Container className="tour-search">
		<Errors errors={props.errors} />
		<SearchInputField {...props} />
		<SearchInputResults {...props} />
	</Container>
);

SearchInput.propTypes = {
	searchQuery: PropTypes.string,
	onSearch: PropTypes.func,
	isLoading: PropTypes.bool,
	searchResults: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		type: PropTypes.oneOf(['event', 'document', 'stakeholder', 'location']).isRequired,
	})),
	type: PropTypes.oneOf(['event', 'document', 'stakeholder', 'location']).isRequired,
	errors: Errors.propTypes.errors,
};

SearchInput.defaultProps = {
	searchQuery: '',
	onSearch: () => {},
	isLoading: false,
	searchResults: [],
	errors: Errors.defaultProps.errors,
};

export default SearchInput;
