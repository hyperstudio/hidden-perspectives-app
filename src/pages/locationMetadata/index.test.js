import React from 'react';
import { shallow } from 'enzyme';
import LocationMetadataPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('LocationMetadataPage', () => {
	const locationMetadataPage = shallow(<LocationMetadataPage match={match} />);
	it('should render without crashing', () => {
		expect(locationMetadataPage.exists()).toBe(true);
	});
});
