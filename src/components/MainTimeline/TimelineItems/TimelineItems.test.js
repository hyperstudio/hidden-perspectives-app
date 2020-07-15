import React from 'react';
import { shallow } from 'enzyme';
import TimelineItems from './TimelineItems';

describe('TimelineItems component', () => {
	const timelineItems = shallow(<TimelineItems />);

	it('should render without crashing', () => {
		expect(timelineItems.exists()).toBe(true);
	});
});
