import React from 'react';
import { shallow } from 'enzyme';
import LocationPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('LocationPage', () => {
	const locationPage = shallow(<LocationPage match={match} />);
	it('should render without crashing', () => {
		expect(locationPage.exists()).toBe(true);
	});
});
