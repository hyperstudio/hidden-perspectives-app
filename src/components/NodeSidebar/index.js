import { compose, withState, lifecycle } from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { either, prop } from 'ramda';
import { withLoading, withErrors, getErrorHandler } from '../../utils/hocUtil';
import { ucFirst } from '../../utils/stringUtil';
import { formatHumanDate } from '../../utils/dateUtil';
import NodeSidebar from './NodeSidebar';

const EVENT_QUERY = gql`
	query GetEvent($id: ID!) {
		Event(id: $id) {
			id
			eventTitle
			eventStartDate
			eventDescription
			eventLocations {
				id
				locationName
			}
		}
	}
`;

const DOCUMENT_QUERY = gql`
	query GetDocument($id: ID!) {
		Document(id: $id) {
			id
			documentTitle
			documentCreationDate
			documentDescription
			documentKind {
				id
				name
			}
			documentAuthors {
				id
				stakeholderFullName
			}
			documentFiles {
				id
				url
			}
			mentionedLocations {
				id
				locationName
			}
		}
	}
`;

const STAKEHOLDER_QUERY = gql`
	query GetStakholder($id: ID!) {
		Stakeholder(id: $id) {
			id
			stakeholderFullName
			stakeholderDescription
		}
	}
`;

const LOCATION_QUERY = gql`
	query GetLocation($id: ID!) {
		Location(id: $id) {
			id
			locationName
			locationDescription
		}
	}
`;

const getResponseProp = (key, type, item) => {
	switch (type) {
	case 'event':
	case 'document': return prop(`${type}${ucFirst(key)}`, item);
	case 'stakeholder': return item.stakeholderFullName;
	case 'location': return item.locationName;
	default: return '';
	}
};

const getItemSubtitle = (item, itemType) => {
	switch (itemType) {
	case 'event': return `Event ・ ${formatHumanDate(new Date(item.eventStartDate))}`;
	case 'document': return `${ucFirst(item.documentKind && item.documentKind[0].Kind.name)} ・ ${formatHumanDate(new Date(item.documentCreationDate))}`;
	case 'stakeholder': return 'Protagonist';
	case 'location': return 'Location';
	default: return '';
	}
};

const getItemDescription = (item, itemType) => item[`${itemType}Description`];

const getItemOriginal = (item, itemType) => {
	if (itemType !== 'document') return undefined;
	return item.documentFiles && item.documentFiles.length > 0
		? item.documentFiles[0].File.url : undefined;
};

const getItemAuthors = (item, itemType) => {
	if (itemType !== 'document') return [];
	return item.documentAuthors.map((author) => ({
		id: author.Stakeholder.id,
		name: author.Stakeholder.stakeholderFullName,
	}));
};

const mapLocation = ({ id, locationName: name }) => ({ id, name });
const getItemLocations = (item, itemType) => {
	if (itemType === 'document') return item.mentionedLocations.map(mapLocation);
	if (itemType === 'event') return item.eventLocations.map(mapLocation);
	return [];
};

const getQueryByItemType = (itemType) => {
	switch (itemType) {
	case 'event': return EVENT_QUERY;
	case 'document': return DOCUMENT_QUERY;
	case 'stakeholder': return STAKEHOLDER_QUERY;
	case 'location': return LOCATION_QUERY;
	default: return '';
	}
};

const getItemParser = (props) => ({ data }) => {
	const {
		setItem,
		itemType,
		stopLoading,
	} = props;
	const dataItemName = ucFirst(itemType);
	const item = data[dataItemName];

	setItem({
		id: item.id,
		date: either(prop('eventStartDate'), prop('documentPublicationDate'))(item),
		title: getResponseProp('title', itemType, item),
		subtitle: getItemSubtitle(item, itemType),
		description: getItemDescription(item, itemType),
		original: getItemOriginal(item, itemType),
		authors: getItemAuthors(item, itemType),
		locations: getItemLocations(item, itemType),
		itemType,
	});
	stopLoading();
};

const performQuery = (props) => {
	const {
		id,
		client,
		itemType,
		startLoading,
	} = props;
	startLoading();
	client.query({
		query: getQueryByItemType(itemType),
		variables: { id },
	})
		.then(getItemParser(props))
		.catch(getErrorHandler(props));
};

export default compose(
	withLoading,
	withErrors,
	withApollo,
	withState('item', 'setItem', undefined),
	lifecycle({
		componentDidMount() {
			if (this.props.item) {
				this.props.stopLoading();
				return;
			}
			performQuery(this.props);
		},
		shouldComponentUpdate(nextProps) {
			const { id } = this.props;
			if (nextProps.id !== id) {
				performQuery(nextProps);
			}
			return (
				this.props.item !== nextProps.item
				|| this.props.isLoading !== nextProps.isLoading
				|| this.props.itemType !== nextProps.itemType
				|| this.props.id !== nextProps.id
			);
		},
	}),
)(NodeSidebar);
