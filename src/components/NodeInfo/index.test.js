import React from 'react';
import { shallow } from 'enzyme';
import NodeInfo from './NodeInfo';

describe('NodeInfo component', () => {
	const fieldset = shallow(
		<NodeInfo
			title="Yo what's up?"
			subtitle="Hey!"
			descriptionExpanded={false}
			toggleDescriptionExpansion={jest.fn()}
		/>,
	);

	it('should render without crashing', () => {
		expect(fieldset.exists()).toBe(true);
	});
});
