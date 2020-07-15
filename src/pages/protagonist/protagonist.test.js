import React from 'react';
import { shallow } from 'enzyme';
import ProtagonistPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('ProtagonistPage', () => {
	const protagonistPage = shallow(<ProtagonistPage match={match} />);
	it('should render without crashing', () => {
		expect(protagonistPage.exists()).toBe(true);
	});
});
