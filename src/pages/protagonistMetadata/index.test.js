import React from 'react';
import { shallow } from 'enzyme';
import ProtagonistMetadataPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('ProtagonistMetadataPage', () => {
	const protagonistMetadataPage = shallow(<ProtagonistMetadataPage match={match} />);
	it('should render without crashing', () => {
		expect(protagonistMetadataPage.exists()).toBe(true);
	});
});
