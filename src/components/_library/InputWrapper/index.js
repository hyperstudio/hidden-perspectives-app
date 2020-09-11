import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import {
	FormGroup,
	Description,
	Label,
	ControlFeedback,
	OptionalText,
} from './styles';

const InputWrapper = ({
	value,
	name,
	children,
	type,
	label,
	error,
	optional,
	multiline,
	nolabel,
	onChange,
	placeholder,
	description,
	labelArticle,
	monospace,
	...rest
}) => (
	<FormGroup>
		{!nolabel && (
			<Label
				htmlFor={name}
				tabIndex="-1"
				id={`${name}-label`}
			>
				{label}
				{optional && <OptionalText>(optional)</OptionalText>}
			</Label>
		)}
		{children({
			name,
			value,
			type,
			onChange,
			multiline,
			monospace,
			id: name,
			placeholder: placeholder || `Enter ${labelArticle} ${label.toLowerCase()}`,
			'aria-labelledby': `${name}-label`,
			valid: !error,
			...rest,
		})}
		{error && <ControlFeedback valid={false}>{error}</ControlFeedback>}
		{description && (
			<Description id={`${name}-description`}>
				{description}
			</Description>
		)}
	</FormGroup>
);

InputWrapper.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
		PropTypes.number,
	]),
	type: PropTypes.string,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	error: PropTypes.string,
	optional: PropTypes.bool,
	nolabel: PropTypes.bool,
	multiline: PropTypes.bool,
	monospace: PropTypes.bool,
	placeholder: PropTypes.string,
	description: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	labelArticle: PropTypes.string,
	children: PropTypes.func,
};

InputWrapper.defaultProps = {
	value: undefined,
	error: '',
	type: 'text',
	description: '',
	placeholder: undefined,
	labelArticle: 'the',
	optional: false,
	nolabel: false,
	multiline: false,
	monospace: false,
	children: (props) => (
		<TextInput
			{...props}
			// eslint-disable-next-line react/prop-types
			onChange={(evt) => props.onChange(evt.target.value)}
		/>
	),
};

export default InputWrapper;

