import React from 'react';
import PropTypes from 'prop-types';
import {
	Container, TagsInput,
} from './styles';

const SearchInputField = ({
	onSearch,
	type,
	value,
	onChange,
}) => (
	<Container autoComplete="off" onSubmit={(evt) => evt.preventDefault()}>
		<TagsInput
			type="text"
			value={value}
			placeholder={`Enter ${type}`}
			onChange={(evt) => {
				onChange(evt);
				onSearch(evt.target.value);
			}}
			id={`search-bar-${type}`}
			autoComplete="off"
		/>
	</Container>
);

SearchInputField.propTypes = {
	onSearch: PropTypes.func,
	type: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
		PropTypes.number,
	]),
	onChange: PropTypes.func.isRequired,
};

SearchInputField.defaultProps = {
	value: undefined,
	onSearch: () => {},
};

export default SearchInputField;
