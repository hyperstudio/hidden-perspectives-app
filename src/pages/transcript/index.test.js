import React from 'react';
import { shallow } from 'enzyme';
import TranscriptPage from '.';

const match = {
	params: { id: 'bob' },
};

describe('TranscriptPage', () => {
	const transcriptPage = shallow(<TranscriptPage match={match} />);
	it('should render without crashing', () => {
		expect(transcriptPage.exists()).toBe(true);
	});
});
