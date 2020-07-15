import React from 'react';
import { shallow } from 'enzyme';
import MetadataPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('MetadataPage', () => {
	const metadataPage = shallow(<MetadataPage match={match} />);
	it('should render without crashing', () => {
		expect(metadataPage.exists()).toBe(true);
	});
});
