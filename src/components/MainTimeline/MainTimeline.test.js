import React from 'react';
import { shallow } from 'enzyme';
import MainTimeline from './MainTimeline';

describe('MainTimeline component with 0 events, 0 documents, 0 protagonists', () => {
	const timeline = shallow(<MainTimeline
		eventsCount={0}
		documentsCount={0}
		protagonistsCount={0}
	/>);

	it('should render without crashing', () => {
		expect(timeline.exists()).toBe(true);
	});
});
