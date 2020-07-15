import React from 'react';
import { shallow } from 'enzyme';
import OriginalPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('OriginalPage', () => {
	const originalPage = shallow(<OriginalPage match={match} />);
	it('should render without crashing', () => {
		expect(originalPage.exists()).toBe(true);
	});
});
