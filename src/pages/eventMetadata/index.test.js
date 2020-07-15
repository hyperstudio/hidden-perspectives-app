import React from 'react';
import { shallow } from 'enzyme';
import EventMetadataPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('EventMetadataPage', () => {
	const eventMetadataPage = shallow(<EventMetadataPage match={match} />);
	it('should render without crashing', () => {
		expect(eventMetadataPage.exists()).toBe(true);
	});
});
