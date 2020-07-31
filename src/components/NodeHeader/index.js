import { withProps } from '@hypnosphi/recompose';
import { curry } from 'ramda';
import { ucFirst } from '../../utils/stringUtil';
import NodeHeader from './NodeHeader';

const createUrl = curry(({ itemType, id }, path) => {
	const type = itemType === 'stakeholder' ? 'protagonist' : itemType;
	return `/${type}/${path}/${id.trim()}`;
});

const createTab = (props, page) => ({
	label: ucFirst(page),
	url: createUrl(props, page),
});

const getEventTabs = (props) => [
	createTab(props, 'context'),
	createTab(props, 'metadata'),
];

const getDocumentTabs = (props) => [
	createTab(props, 'context'),
	createTab(props, 'transcript'),
	createTab(props, 'original'),
	createTab(props, 'metadata'),
];

const getStakeholderTabs = (props) => [
	createTab(props, 'context'),
	createTab(props, 'metadata'),
];

const getLocationTabs = (props) => [
	createTab(props, 'context'),
	createTab(props, 'metadata'),
];

const getTabs = (props) => {
	const { itemType } = props;

	switch (itemType) {
	case 'event': return getEventTabs(props);
	case 'document': return getDocumentTabs(props);
	case 'stakeholder': return getStakeholderTabs(props);
	case 'location': return getLocationTabs(props);
	default: return '';
	}
};

const createEditUrl = (props) => `${createUrl(props, 'metadata')}/edit`;
const createProps = (props) => ({
	tabs: getTabs(props),
	editUrl: createEditUrl(props),
});

export default withProps(createProps)(NodeHeader);
