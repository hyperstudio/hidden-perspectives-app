import React from 'react';
import PropTypes from 'prop-types';
import {
	Container, Field, FieldChildren, ClearButton,
} from './styles';
import TextInput from '../../_library/TextInput';

const SearchInputField = ({
	searchQuery,
	onSearch,
	type,
	children,
	name,
	value,
	onChange,
}) => (
	<Container autoComplete="off" onSubmit={(evt) => evt.preventDefault()}>
		<Field
			type="text"
			value={searchQuery}
			placeholder={`Search for ${type}s`}
			onChange={(evt) => onSearch(evt.target.value)}
			id={`search-bar-${type}`}
			autoComplete="off"
		/>
		<FieldChildren>
			{children({
				name,
				value,
				onChange,
				id: name,
			})}
		</FieldChildren>
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

SearchInputField.propTypes = {
	searchQuery: PropTypes.string,
	onSearch: PropTypes.func,
	type: PropTypes.string.isRequired,
	children: PropTypes.func,
	value: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
		PropTypes.number,
	]),
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

SearchInputField.defaultProps = {
	value: undefined,
	searchQuery: '',
	onSearch: () => {},
	children: (props) => (
		<TextInput
			{...props}
			// eslint-disable-next-line react/prop-types
			onChange={(evt) => props.onChange(evt.target.value)}
		/>
	),
};

export default SearchInputField;
