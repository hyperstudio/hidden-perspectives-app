import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('Header component', () => {
	const headerComponent = shallow(<Header />);
	it('should render without crashing', () => {
		expect(headerComponent.exists()).toBe(true);
	});
});
