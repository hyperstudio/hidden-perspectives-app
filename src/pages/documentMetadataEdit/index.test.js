import React from 'react';
import { shallow } from 'enzyme';
import MetadataEditPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('MetadataEditPage', () => {
	const metadataEditPage = shallow(<MetadataEditPage match={match} />);
	it('should render without crashing', () => {
		expect(metadataEditPage.exists()).toBe(true);
	});
});
