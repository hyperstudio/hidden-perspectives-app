import React from 'react';
import { shallow } from 'enzyme';
import SummarySection from './SummarySection';

describe('SummarySection component with empty tags and empty filteredTags', () => {
	const summarySection = shallow(<SummarySection
		tags={[]}
		filteredTags={[]}
		history={{ push: jest.fn() }}
	/>);

	it('should render without crashing', () => {
		expect(summarySection.exists()).toBe(true);
	});
});

describe('SummarySection component with 2 tags and empty filteredTags', () => {
	const summarySection = shallow(<SummarySection
		tags={[{ id: 'TestTag1' }, { id: 'TestTag2' }]}
		filteredTags={[]}
		history={{ push: jest.fn() }}
	/>);

	it('should render without crashing', () => {
		expect(summarySection.exists()).toBe(true);
	});
});

describe('SummarySection component with 2 tags and 1 filteredTags', () => {
	const summarySection = shallow(<SummarySection
		tags={[{ id: 'TestTag1' }, { id: 'TestTag2' }]}
		filteredTags={['TestTag1']}
		history={{ push: jest.fn() }}
	/>);

	it('should render without crashing', () => {
		expect(summarySection.exists()).toBe(true);
	});
});

