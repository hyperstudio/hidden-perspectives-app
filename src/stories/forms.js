import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
	compose,
	withHandlers,
	withState,
} from '@hypnosphi/recompose';
import OriginalCreateDocumentForm from '../components/CreateForm';
import { StoryWrapper } from './styles';

const CreateFormWithState = compose(
	withState('dateValue', 'onDateChange', ({ value }) => value || ''),
	withState('publicationDateValue', 'onPublicationDateChange', ({ value }) => value || ''),
	withHandlers({
		onSubmit: () => action('Form submitted!'),
	}),
)(OriginalCreateDocumentForm);

const CreateForm = (props) => (
	<StoryWrapper maxWidth={688}>
		<CreateFormWithState {...props} />
	</StoryWrapper>
);
CreateForm.propTypes = OriginalCreateDocumentForm.propTypes;

storiesOf('Forms', module)
	.add('Create document form', () => (
		<CreateForm />
	));


