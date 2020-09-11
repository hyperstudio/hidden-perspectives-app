import React from 'react';
import { shallow } from 'enzyme';
import CreatePage from '.';
import CreateForm from '../../components/CreateForm';

describe('CreatePage', () => {
	const createPage = shallow(<CreatePage itemType="document" />);

	it('should render without crashing', () => {
		expect(createPage.length).toBe(1);
	});

	it('should render the CreateForm Component', () => {
		expect(createPage.find(CreateForm).length).toBe(1);
	});
});

