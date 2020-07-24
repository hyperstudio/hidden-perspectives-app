import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withState } from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	prop,
	pipe,
	length,
	ifElse,
	identity,
	always,
} from 'ramda';
import { withLoading, withErrors, getErrorHandler } from '../../utils/hocUtil';
import MetadataView from './MetadataView';
import { getFormattedDate } from '../../utils/dateUtil';
import Tag from '../_library/Tag';
import Stakeholder from '../_library/Stakeholder';
import Item from '../_library/Item';

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

const propHasValue = (propName) => pipe(
	prop(propName),
	ifElse(Array.isArray, length, Boolean),
);
const hasValue = propHasValue('value');
const hasValues = propHasValue('values');
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

const structureDocumentData = (data) => {
	const coreInformation = {
		groupLabel: 'Core information',
		values: [
			{ label: 'Title', value: data.documentTitle },
			{ label: 'Summary', value: data.documentDescription },
			{
				label: 'Authors',
				value: data.documentAuthors.map(mapStakeholder),
				ValueComponent: passValueAsChild(Stakeholder, 'protagonist'),
			},
			{ label: 'Creation date', value: formatIfValidDate(data.documentCreationDate) },
			{ label: 'Publication date', value: formatIfValidDate(data.documentPublicationDate) },
		].filter(hasValue),
	};

	const appearences = {
		groupLabel: 'Appearences',
		values: [
			{
				label: 'Protagonists',
				value: data.mentionedStakeholders.map(mapStakeholder),
				ValueComponent: passValueAsChild(Stakeholder, 'protagonist'),
			},
			{
				label: 'Locations',
				value: data.mentionedLocations.map(mapLocation),
				ValueComponent: passValueAsChild(Item, 'location'),
			},
		].filter(hasValue),
	};
	const docTagsRedone = [];
	data.documentTags.forEach((element) => {
		docTagsRedone.push(element.Tag);
	});
	const categorization = {
		groupLabel: 'Categorization',
		values: [
			{ label: 'Kind', value: data.documentKind[0].Kind.name },
			{ label: 'Classification', value: data.documentClassification[0].Classification.name },
			{
				label: 'Tags',
				value: docTagsRedone,
				ValueComponent: passValueAsChild(Tag),
			},
		].filter(hasValue),
	};

	return [
		coreInformation,
		appearences,
		categorization,
	].filter(hasValues);
};

const structureEventData = (data) => {
	const {
		eventTitle,
		eventDescription,
		eventStartDate,
		eventEndDate,
		eventStakeholders,
		eventLocations,
		eventTags,
	} = data;

	const coreInformation = {
		groupLabel: 'Core information',
		values: [
			{ label: 'Title', value: eventTitle },
			{ label: 'Description', value: eventDescription },
			{ label: 'Start date', value: formatIfValidDate(eventStartDate) },
			{ label: 'End date', value: formatIfValidDate(eventEndDate) },
		].filter(hasValue),
	};

	const appearences = {
		groupLabel: 'Appearences',
		values: [
			{
				label: 'Protagonists',
				value: eventStakeholders.map(mapStakeholder),
				ValueComponent: passValueAsChild(Stakeholder, 'protagonist'),
			},
			{
				label: 'Locations',
				value: eventLocations.map(mapLocation),
				ValueComponent: passValueAsChild(Item, 'location'),
			},
		].filter(hasValue),
	};

	const categorization = {
		groupLabel: 'Categorization',
		values: [
			{
				label: 'Tags',
				value: eventTags,
				ValueComponent: passValueAsChild(Tag),
			},
		].filter(hasValue),
	};

	return [
		coreInformation,
		appearences,
		categorization,
	].filter(hasValues);
};

const structureStakeholderData = (data) => {
	const {
		documents,
		documentsMentionedIn,
		eventsInvolvedIn,
		stakeholderDescription,
		stakeholderFullName,
		stakeholderWikipediaUri,
	} = data;

	const coreInformation = {
		groupLabel: 'Core information',
		values: [
			{ label: 'Title', value: stakeholderFullName },
			{ label: 'Description', value: stakeholderDescription },
			{ label: 'Wikipedia', value: stakeholderWikipediaUri },
		].filter(hasValue),
	};

	const authored = {
		groupLabel: 'Authored',
		values: [
			{
				label: 'Documents',
				value: documents.map(mapDocuments),
				ValueComponent: passValueAsChild(Item, 'document'),
			},
		].filter(hasValue),
	};

	const appearences = {
		groupLabel: 'Appearences',
		values: [
			{
				label: 'Documents',
				value: documentsMentionedIn.map(mapDocuments),
				ValueComponent: passValueAsChild(Item, 'document'),
			},
			{
				label: 'Events',
				value: eventsInvolvedIn.map(mapEvents),
				ValueComponent: passValueAsChild(Item, 'event'),
			},
		].filter(hasValue),
	};

	return [
		coreInformation,
		authored,
		appearences,
	].filter(hasValues);
};

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
		].filter(hasValue),
	};

	const appearences = {
		groupLabel: 'Appearences',
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
		].filter(hasValue),
	};

	return [
		coreInformation,
		appearences,
	].filter(hasValues);
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
	withState('data', 'setData', []),
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
)(MetadataView);
