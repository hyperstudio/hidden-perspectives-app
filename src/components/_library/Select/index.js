import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import Select from 'react-select';
import { Control, Menu } from './styles';

const SelectInput = ({
	id,
	name,
	onChange,
	value,
	options,
	valid,
	placeholder,
	theme,
	...rest
}) => (
	<Select
		{...rest}
		id={id}
		name={name}
		onChange={onChange}
		value={value}
		valid={valid}
		control
		multiline={undefined}
		options={options}
		placeholder={placeholder}
		isSearchable={false}
		theme={(reactSelectTheme) => ({
			...reactSelectTheme,
			...theme.selectTheme,
		})}
		components={{ Control, Menu }}
		appTheme={theme}
	/>
);

const optionPropTypes = PropTypes.shape({
	value: PropTypes.string,
	label: PropTypes.string,
});

SelectInput.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		optionPropTypes,
	]),
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	valid: PropTypes.bool,
	options: PropTypes.arrayOf(optionPropTypes).isRequired,
	theme: PropTypes.shape({
		selectTheme: PropTypes.shape({
			colors: PropTypes.shape({ }),
		}),
	}).isRequired,
};

SelectInput.defaultProps = {
	onChange: () => {},
	valid: true,
	value: undefined,
	placeholder: 'Select an item',
};

export default withTheme(SelectInput);

