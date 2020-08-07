import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withState } from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	ifElse,
	identity,
	always,
} from 'ramda';
import { withLoading, withErrors, getErrorHandler } from '../../utils/hocUtil';
import MetadataEditView from './MetadataEditView';
import { getFormattedDate } from '../../utils/dateUtil';
import Item from '../_library/Item';
import reOrganizeItems from '../../utils/reorganizeUtil';

const DOCUMENT_QUERY = gql`
	query GetDocument($id: String) {
		document(where: {id: $id}) {
			id
			documentTitle
			documentDescription
			documentKind {
				Kind {
					id
					name
				}
			}
			documentClassification {
				Classification {
					id
					name
				}
			}
			documentAuthors {
				Stakeholder {
					id
					stakeholderFullName
				}
			}
			documentCreationDate
			documentPublicationDate
			mentionedStakeholders {
				Stakeholder {
					id
					stakeholderFullName
				}
			}
			mentionedLocations {
				Location {
					id,
					locationName
				}
			}
			documentTags {
				Tag{
					id,
					name
				}											
			}
		}
	}
`;

const EVENT_QUERY = gql`
	query GetEvent($id: String) {
		event(where: {id: $id}) {
			id
			eventTitle
			eventDescription
			eventStartDate
			eventEndDate
			eventStakeholders {
				Stakeholder{
					id
					stakeholderFullName
				}
			}
			eventTags {
				Tag {
					id,
					name			
				}									
			}
			eventLocations {
				Location{
					id,
					locationName
				}
			}
		}
	}
`;

const STAKEHOLDER_QUERY = gql`
	query GetStakeholder($id: String) {
		stakeholder(where: {id: $id}) {
			id
			documents {
				Document{
					id
					documentTitle
				}
			}
			documentsMentionedIn {
				Document{
					id
					documentTitle
				}
			}
			eventsInvolvedIn {
				Event {
					id
					eventTitle
				}
			}
			stakeholderDescription
			stakeholderFullName
			stakeholderWikipediaUri
		}
	}
`;

const LOCATION_QUERY = gql`
	query GetLocation($id: String) {
		location(where: {id: $id}) {
			id
			documentsMentionedIn {
				Document{
					id
					documentTitle
				}
			}
			locationEvents {
				Event {
					id
					eventTitle
				}
			}
			locationDescription
			locationName
			locationWikipediaUri
		}
	}
`;

const mapStakeholder = ({ Stakeholder: { id, stakeholderFullName } }) => ({
	id, name: stakeholderFullName,
});
const mapLocation = ({ Location: { id, locationName } }) => ({
	id, name: locationName,
});
const mapDocuments = ({ Document: { id, documentTitle } }) => ({
	id, name: documentTitle,
});
const mapEvents = ({ Event: { id, eventTitle } }) => ({
	id, name: eventTitle,
});

const formatIfValidDate = ifElse(identity, getFormattedDate, always(null));

const passValueAsChild = (Component, itemType) => {
	const WrapperComponent = ({ value, ...props }) => (
		<Component
			{...props}
			to={itemType && `/${itemType}/context/${props.id}`}
			itemType={itemType}
		>
			{value}
		</Component>
	);
	WrapperComponent.propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array,
			PropTypes.shape({}),
		]).isRequired,
		id: PropTypes.string.isRequired,
	};

	return WrapperComponent;
};

const structureDocumentData = (data) => ({
	title: data.documentTitle,
	description: data.documentDescription,
	authors: data.documentAuthors.map(mapStakeholder),
	creationDate: formatIfValidDate(data.documentCreationDate),
	publicationDate: formatIfValidDate(data.documentPublicationDate),
	stakeholders: data.mentionedStakeholders.map(mapStakeholder),
	locations: data.mentionedLocations.map(mapLocation),
	kind: { value: data.documentKind[0].Kind.name, label: data.documentKind[0].Kind.name },
	classification: {
		value: data.documentClassification[0].Classification.name,
		label: data.documentClassification[0].Classification.name,
	},
	tags: reOrganizeItems(data.documentTags, 'tag'),
});

const structureEventData = (data) => ({
	title: data.eventTitle,
	description: data.eventDescription,
	eventStartDate: formatIfValidDate(data.eventStartDate),
	eventEndDate: formatIfValidDate(data.eventEndDate),
	stakeholders: data.eventStakeholders.map(mapStakeholder),
	locations: data.eventLocations.map(mapLocation),
	tags: reOrganizeItems(data.eventTags, 'tag'),
});

const structureStakeholderData = (data) => ({
	title: data.stakeholderFullName,
	description: data.stakeholderDescription,
	stakeholderWikipediaUri: data.stakeholderWikipediaUri,
	stakeholderAuthoredDocuments: data.documents.map(mapDocuments),
	documentsMentionedIn: data.documentsMentionedIn.map(mapDocuments),
	eventsInvolvedIn: data.eventsInvolvedIn.map(mapEvents),
});

const structureLocationData = (data) => {
	const {
		locationDescription,
		locationName,
		locationWikipediaUri,
		documentsMentionedIn,
		locationEvents,
	} = data;

	const coreInformation = {
		groupLabel: 'Core information',
		values: [
			{ label: 'Title', value: locationName },
			{ label: 'Description', value: locationDescription },
			{ label: 'Wikipedia', value: locationWikipediaUri },
		],
	};

	const appearances = {
		groupLabel: 'Appearances',
		values: [
			{
				label: 'Documents',
				value: documentsMentionedIn.map(mapDocuments),
				ValueComponent: passValueAsChild(Item, 'document'),
			},
			{
				label: 'Events',
				value: locationEvents.map(mapEvents),
				ValueComponent: passValueAsChild(Item, 'event'),
			},
		],
	};

	return [
		coreInformation,
		appearances,
	];
};

const getStructuredData = (data, itemType) => {
	switch (itemType) {
	case 'event': return structureEventData(data.event);
	case 'document': return structureDocumentData(data.document);
	case 'stakeholder': return structureStakeholderData(data.stakeholder);
	case 'location': return structureLocationData(data.location);
	default: return '';
	}
};

const getDataParser = ({ stopLoading, setData, itemType }) => ({ data }) => {
	stopLoading();
	const structuredData = getStructuredData(data, itemType);
	setData(structuredData);
};

const getItemQuery = (itemType) => {
	switch (itemType) {
	case 'event': return EVENT_QUERY;
	case 'document': return DOCUMENT_QUERY;
	case 'stakeholder': return STAKEHOLDER_QUERY;
	case 'location': return LOCATION_QUERY;
	default: return '';
	}
};

export default compose(
	withApollo,
	withLoading,
	withErrors,
	withState('data', 'setData', {}),
	lifecycle({
		componentDidMount() {
			const { id, client, itemType } = this.props;
			client.query({
				query: getItemQuery(itemType),
				variables: { id },
			})
				.then(getDataParser(this.props))
				.catch(getErrorHandler(this.props));
		},
	}),
)(MetadataEditView);
