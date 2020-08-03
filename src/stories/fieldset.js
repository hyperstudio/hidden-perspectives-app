import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Fieldset from '../components/_library/Fieldset';
import Button from '../components/_library/Button';
import { StoryWrapper } from './styles';

storiesOf('Fieldset', module)
	.add('With string as children', () => (
		<StoryWrapper maxWidth={640}>
			<Fieldset title="This is a fieldset">
				And I am its content
			</Fieldset>
		</StoryWrapper>
	))
	.add('With component as children', () => (
		<StoryWrapper maxWidth={640}>
			<Fieldset title="This is a fieldset">
				<Router>
					<Button variant="light">Click me if you can</Button>
				</Router>
			</Fieldset>
		</StoryWrapper>
	));
