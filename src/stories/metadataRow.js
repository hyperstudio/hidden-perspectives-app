/* eslint-disable max-len */
import React from 'react';
import { storiesOf } from '@storybook/react';
import MetadataRow from '../components/_library/MetadataRow';
import TextInput from '../components/_library/TextInput';
import DatePicker from '../components/_library/DatePicker';
import { StoryWrapper } from './styles';

storiesOf('MetadataRow', module)
	.add('Single row', () => (
		<StoryWrapper maxWidth={640}>
			<MetadataRow label="Title">
				Iran reports to the U.N. a number of violations of Irans sovereignty
			</MetadataRow>
		</StoryWrapper>
	))
	.add('Multiple rows in display mode', () => (
		<StoryWrapper maxWidth={640}>
			<MetadataRow label="Title">
				Iran reports to the U.N. a number of violations of Irans sovereignty
			</MetadataRow>
			<MetadataRow label="Summary">
				Iran announces an agreement with Moscow on importing goods through the Soviet Union in the event of an American naval Blockade.
			</MetadataRow>
			<MetadataRow label="Start-Date">
				21/11/1980
			</MetadataRow>
			<MetadataRow label="End-Date">
				24/11/1980
			</MetadataRow>
		</StoryWrapper>
	))
	.add('Multiple rows in edit mode', () => (
		<StoryWrapper maxWidth={640} background="whitesmoke">
			<MetadataRow label="Title" mode="edit">
				<TextInput
					valid
					value="Iran reports to the U.N. a number of violations of Irans sovereignty"
				/>
			</MetadataRow>
			<MetadataRow label="Summary" mode="edit">
				<TextInput
					valid
					multiline
					value="Iran announces an agreement with Moscow on importing goods through the Soviet Union in the event of an American naval Blockade."
				/>
			</MetadataRow>
			<MetadataRow label="Start-Date" mode="edit">
				<DatePicker valid value="21-11-1980" />
			</MetadataRow>
			<MetadataRow label="End-Date" mode="edit">
				<DatePicker valid value="24-11-1980" />
			</MetadataRow>
		</StoryWrapper>
	));
