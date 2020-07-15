import React from 'react';
import { shallow } from 'enzyme';
import Item from './Item';

describe('Item component', () => {
	const item = shallow(
		<Item
			itemType="test"
		>
			Item!
		</Item>,
	);

	it('should render without crashing', () => {
		expect(item.exists()).toBe(true);
	});
});
