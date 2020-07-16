import React from 'react';
import { storiesOf } from '@storybook/react';
import Stakeholder from '../components/_library/Stakeholder';
import { StoryWrapper } from './styles';

storiesOf('Stakeholders', module)
	.add('Display stakeholder', () => (
		<StoryWrapper>
			<Stakeholder altText="Bill Clinton">
				Bill Clinton
			</Stakeholder>
			<Stakeholder
				image="https://cdn.images.express.co.uk/img/dynamic/galleries/64x64/66150.jpg"
			>
				Barack Obama
			</Stakeholder>
			<Stakeholder
				image="https://cdn.images.express.co.uk/img/dynamic/galleries/64x64/167478.jpg"
			>
				Hillary Clinton
			</Stakeholder>
			<Stakeholder>
				Extremely long stakeholder containing lots and lots of text!!
			</Stakeholder>
			<Stakeholder
				image="https://ww2.kqed.org/wp-content/uploads/sites/12/2015/04/hillary-clinton-running-president-64x64.jpg"
			>
				Stakeholder with normal length
			</Stakeholder>
		</StoryWrapper>
	));
