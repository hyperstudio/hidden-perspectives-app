import React from 'react';
import { shallow } from 'enzyme';
import MetadataEditView from '.';

describe('DocumentMetadataEditView component', () => {
	const metadataEditView = shallow(<MetadataEditView />);

	it('should render without crashing', () => {
		expect(metadataEditView.exists()).toBe(true);
	});
});
