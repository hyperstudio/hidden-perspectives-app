import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { compose, withHandlers, withState } from '@hypnosphi/recompose';
import OriginalInputWrapper from '../components/_library/InputWrapper';
import { StoryWrapper } from './styles';
import Select from '../components/_library/Select';
import DatePicker from '../components/_library/DatePicker';

const InputWrapperWithState = compose(
	withState('value', 'onChange', ({ value }) => value || ''),
	withHandlers({
		onChange: ({ onChange }) => (val) => {
			action('Value changed:')(val);
			onChange(val);
		},
	}),
)(OriginalInputWrapper);

const InputWrapper = (props) => (
	<StoryWrapper maxWidth={props.storyMaxWidth}>
		<InputWrapperWithState {...props} />
	</StoryWrapper>
);
InputWrapper.propTypes = OriginalInputWrapper.propTypes;

const required = {
	name: 'storybook-input',
	label: 'First name',
	labelArticle: 'your',
	onChange: () => {},
};

storiesOf('Input Wrapper', module)
	.add('Empty TextInput', () => (
		<InputWrapper {...required} />
	))
	.add('TextInput filled by default', () => (
		<InputWrapper {...required} value="Sponge Bob" />
	))
	.add('TextInput with description', () => (
		<InputWrapper
			{...required}
			description="Please don't use numbers"
		/>
	))
	.add('Invalid TextInput', () => (
		<InputWrapper
			{...required}
			error="This field is required"
		/>
	))
	.add('Invalid TextInput with description', () => (
		<InputWrapper
			{...required}
			description="Please don't use numbers"
			error="This field is required"
		/>
	))
	.add('Disabled TextInput', () => (
		<InputWrapper
			{...required}
			disabled
		/>
	))
	.add('Password TextInput', () => (
		<InputWrapper
			{...required}
			type="password"
			label="Password"
		/>
	))
	.add('Number TextInput', () => (
		<InputWrapper
			{...required}
			description="Access is denied to minors under 18 years of age"
			label="Age"
			type="number"
			min={18}
			value={18}
			storyMaxWidth={200}
		/>
	))
	.add('Optional TextInput', () => (
		<InputWrapper
			{...required}
			optional
		/>
	))
	.add('No label TextInput', () => (
		<InputWrapper
			{...required}
			nolabel
		/>
	))
	.add('With Select', () => (
		<InputWrapper
			{...required}
			label="Options"
			options={[
				{ name: 'option-1', text: 'Option 1' },
				{ name: 'option-2', text: 'Option 2' },
				{ name: 'option-3', text: 'Option 3' },
			]}
		>
			{(props) => <Select {...props} />}
		</InputWrapper>
	))
	.add('With invalid Select and description', () => (
		<InputWrapper
			{...required}
			label="Options"
			options={[
				{ name: 'option-1', text: 'Option 1' },
				{ name: 'option-2', text: 'Option 2' },
				{ name: 'option-3', text: 'Option 3' },
			]}
			error="The selected option is not right, just not right."
			description="Choose the right option please."
		>
			{(props) => <Select {...props} />}
		</InputWrapper>
	))
	.add('With DatePicker', () => (
		<InputWrapper
			{...required}
			label="Birth date"
			description="When where you born?"
			todayOrPrior
			storyMaxWidth={360}
		>
			{(props) => <DatePicker {...props} />}
		</InputWrapper>
	));

