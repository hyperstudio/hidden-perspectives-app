import React from 'react';
import { shallow } from 'enzyme';
import Theme from '../../Theme';
import TimelineElement from './TimelineElement';

const requiredProps = {
	itemType: 'document',
	id: 'woifheoifhweiof',
	path: '/context/document/woifheoifhweiof',
	title: 'When Empathy Failed: Using Critical Oral History to Re-visit the Collapse of U.S.-Soviet Detente in the Carter-Brezhnev Years',
	hoverHandler: () => {},
	hovered: false,
	history: { push: jest.fn() },
};

describe('TimelineElement component', () => {
	const timelineElement = shallow(
		<Theme>
			<TimelineElement {...requiredProps} />
		</Theme>,
	);

	it('should render without crashing', () => {
		expect(timelineElement.exists()).toBe(true);
	});
});
