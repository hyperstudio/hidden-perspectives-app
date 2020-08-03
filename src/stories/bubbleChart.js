import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BubbleChart from '../components/BubbleChart';
import { StoryWrapper } from './styles';

const testDataSingle = {
	itemKey: [
		{
			Stakeholder: {
				id: '123',
				stakeholderFullName: 'Bill Clinton',
			},
		},
	],
};

const testDataMultiple = {
	firstItemKey: [
		{
			Stakeholder: {
				id: '123',
				stakeholderFullName: 'Hillary Clinton',
			},
		},
	],
	secondItemKey: [
		{
			Stakeholder: {
				id: '234',
				stakeholderFullName: 'Bill Clinton',
			},
		},
		{
			Stakeholder: {
				id: '234',
				stakeholderFullName: 'Mohammad Khatami',
			},
		},
	],
	thirdItemKey: [
		{
			Stakeholder: {
				id: '345',
				stakeholderFullName: 'US Department of State',
			},
		},
		{
			Stakeholder: {
				id: '345',
				stakeholderFullName: 'US Department of Defense',
			},
		},
		{
			Stakeholder: {
				id: '345',
				stakeholderFullName: 'Reuters',
			},
		},
	],
};

storiesOf('BubbleChart', module)
	.add('With one item', () => (
		<StoryWrapper maxWidth={380}>
			<Router>
				<BubbleChart
					items={testDataSingle}
					diameter={300}
					bubblesPadding={15}
				/>
			</Router>
		</StoryWrapper>
	))
	.add('With multiple items', () => (
		<StoryWrapper maxWidth={380}>
			<Router>
				<BubbleChart
					items={testDataMultiple}
					diameter={300}
					bubblesPadding={15}
				/>
			</Router>
		</StoryWrapper>
	))
	.add('With loading items', () => (
		<StoryWrapper maxWidth={380}>
			<BubbleChart
				isLoading
				items={testDataMultiple}
				diameter={300}
				bubblesPadding={15}
			/>
		</StoryWrapper>
	));
