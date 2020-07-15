import React from 'react';
import { shallow } from 'enzyme';
import DocumentPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('DocumentPage', () => {
	const documentPage = shallow(<DocumentPage match={match} />);
	it('should render without crashing', () => {
		expect(documentPage.exists()).toBe(true);
	});
});
