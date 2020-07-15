import React from 'react';
import { shallow } from 'enzyme';
import EventPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('EventPage', () => {
	const eventPage = shallow(<EventPage match={match} />);
	it('should render without crashing', () => {
		expect(eventPage.exists()).toBe(true);
	});
});
