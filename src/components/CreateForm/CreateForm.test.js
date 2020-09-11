import React from 'react';
import { shallow } from 'enzyme';
import CreateForm from '.';

describe('CreateForm', () => {
	const createForm = shallow(<CreateForm itemType="document" />);

	it('should render without crashing', () => {
		expect(createForm.exists()).toBe(true);
	});
});

