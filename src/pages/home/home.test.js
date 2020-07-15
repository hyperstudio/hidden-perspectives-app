import React from 'react';
import { shallow } from 'enzyme';
import Home from '.';

describe('Home', () => {
	const homePage = shallow(<Home />);
	it('should render without crashing', () => {
		expect(homePage.exists()).toBe(true);
	});
});
