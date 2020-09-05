import { withRouter } from 'react-router-dom';
import {
	compose,
	lifecycle,
	withState,
	withHandlers,
} from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	ifElse,
	identity,
	always,
} from 'ramda';
import { withLoading, getErrorHandler } from '../../utils/hocUtil';
import MetadataEditView from './MetadataEditView';
import { getFormattedDate } from '../../utils/dateUtil';
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

const DOCUMENT_MUTATION = gql`
mutation UpdateDocument($id: String, $data: DocumentUpdateInput!){
  updateOneDocument(where: {id: $id}, data: $data){
    documentTitle
    documentDescription
    documentCreationDate
    documentPublicationDate
  }
}
`;

const EVENT_MUTATION = gql`
mutation UpdateEvent($id: String, $data: EventUpdateInput!){
  updateOneEvent(where: {id: $id}, data: $data){
    eventTitle
    eventDescription
    eventStartDate
		eventEndDate
  }
}
`;

const STAKEHOLDER_MUTATION = gql`
mutation UpdateStakeholder($id: String, $data: StakeholderUpdateInput!){
  updateOneStakeholder(where: {id: $id}, data: $data){
    stakeholderFullName
    stakeholderDescription
    stakeholderWikipediaUri
  }
}
`;

const LOCATION_MUTATION = gql`
mutation UpdateStakeholder($id: String, $data: LocationUpdateInput!){
  updateOneLocation(where: {id: $id}, data: $data){
		locationName
		locationDescription
		locationWikipediaUri
  }
}
`;

const DOCUMENT_DELETION = gql`
mutation DeleteDocument($id: String){
	deleteOneDocument(where: {id: $id}){
		id
	}
}
`;
const EVENT_DELETION = gql`
mutation DeleteEvent($id: String){
	deleteOneEvent(where: {id: $id}){
		id
	}
}
`;
const STAKEHOLDER_DELETION = gql`
mutation DeleteStakeholder($id: String){
	deleteOneStakeholder(where: {id: $id}){
		id
	}
}
`;
const LOCATION_DELETION = gql`
mutation DeleteLocation($id: String){
	deleteOneLocation(where: {id: $id}){
		id
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

const structureDocumentData = (data) => ({
	id: data.id,
	title: data.documentTitle,
	description: data.documentDescription,
	authors: data.documentAuthors.map(mapStakeholder),
	creationDate: formatIfValidDate(data.documentCreationDate),
	publicationDate: formatIfValidDate(data.documentPublicationDate),
	stakeholders: data.mentionedStakeholders.map(mapStakeholder),
	locations: data.mentionedLocations.map(mapLocation),
	kind: data.documentKind[0] ? {
		value: data.documentKind[0].Kind.name,
		label: data.documentKind[0].Kind.name,
	} : undefined,
	classification: data.documentClassification[0] ? {
		value: data.documentClassification[0].Classification.name,
		label: data.documentClassification[0].Classification.name,
	} : undefined,
	tags: reOrganizeItems(data.documentTags, 'tag'),
});

const structureEventData = (data) => ({
	id: data.id,
	title: data.eventTitle,
	description: data.eventDescription,
	eventStartDate: formatIfValidDate(data.eventStartDate),
	eventEndDate: formatIfValidDate(data.eventEndDate),
	stakeholders: data.eventStakeholders.map(mapStakeholder),
	locations: data.eventLocations.map(mapLocation),
	tags: reOrganizeItems(data.eventTags, 'tag'),
});

const structureStakeholderData = (data) => ({
	id: data.id,
	title: data.stakeholderFullName,
	description: data.stakeholderDescription,
	wikipediaUri: data.stakeholderWikipediaUri,
	stakeholderAuthoredDocuments: data.documents.map(mapDocuments),
	documentsMentionedIn: data.documentsMentionedIn.map(mapDocuments),
	eventsInvolvedIn: data.eventsInvolvedIn.map(mapEvents),
});

const structureLocationData = (data) => ({
	id: data.id,
	title: data.locationName,
	description: data.locationDescription,
	wikipediaUri: data.locationWikipediaUri,
	documentsMentionedIn: data.documentsMentionedIn.map(mapDocuments),
	eventsInvolvedIn: data.locationEvents.map(mapEvents),
});

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

const dateExists = (date) => date && date !== '' && date !== null;

const getDestructuredData = (data) => {
	switch (data.itemType) {
	case 'document': return {
		documentTitle: { set: data.title },
		documentDescription: { set: data.description },
		documentCreationDate: dateExists(data.creationDate) ? { set: new Date(`${data.creationDate} 00:00`) } : undefined,
		documentPublicationDate: dateExists(data.publicationDate) ? { set: new Date(`${data.publicationDate} 00:00`) } : undefined,
		documentKind: data.kind.value ? {
			create: {
				Kind: {
					connect: {
						// eslint-disable-next-line quote-props
						'name': data.kind.value.toLowerCase(),
					},
				},
			},
		} : undefined,
		documentClassification: data.classification.value ? {
			create: {
				Classification: {
					connect: {
						// eslint-disable-next-line quote-props
						'name': data.classification.value.toLowerCase(),
					},
				},
			},
		} : undefined,
		documentTags: Array.isArray(data.tags)
			? {
				create: data.tags.map((tag) => ({
					Tag: {
						connectOrCreate: {
							where: { 'name': tag.name }, // eslint-disable-line quote-props
							create: { 'name': tag.name }, // eslint-disable-line quote-props
						},
					},
				})),
			}
			: undefined,
		documentAuthors: Array.isArray(data.authors)
			? {
				create: data.authors.map((author) => ({
					Stakeholder: {
						connect: {
							id: author.id,
						},
					},
				})),
			}
			: undefined,
		mentionedStakeholders: Array.isArray(data.stakeholders)
			? {
				create: data.stakeholders.map((stakeholder) => ({
					Stakeholder: {
						connect: {
							id: stakeholder.id,
						},
					},
				})),
			}
			: undefined,
		mentionedLocations: Array.isArray(data.locations)
			? {
				create: data.locations.map((location) => ({
					Location: {
						connectOrCreate: {
							where: { 'locationName': location.name }, // eslint-disable-line quote-props
							create: { 'locationName': location.name }, // eslint-disable-line quote-props
						},
					},
				})),
			}
			: undefined,
	};
	case 'event': return {
		eventTitle: { set: data.title },
		eventDescription: { set: data.description },
		eventStartDate: dateExists(data.eventStartDate) ? { set: new Date(`${data.eventStartDate} 00:00`) } : undefined,
		eventEndDate: dateExists(data.eventEndDate) ? { set: new Date(`${data.eventEndDate} 00:00`) } : undefined,
		eventTags: Array.isArray(data.tags)
			? {
				create: data.tags.map((tag) => ({
					Tag: {
						connectOrCreate: {
							where: { 'name': tag.name }, // eslint-disable-line quote-props
							create: { 'name': tag.name }, // eslint-disable-line quote-props
						},
					},
				})),
			}
			: undefined,
		eventStakeholders: Array.isArray(data.stakeholders)
			? {
				create: data.stakeholders.map((stakeholder) => ({
					Stakeholder: {
						connect: {
							id: stakeholder.id,
						},
					},
				})),
			}
			: undefined,
		eventLocations: Array.isArray(data.locations)
			? {
				create: data.locations.map((location) => ({
					Location: {
						connectOrCreate: {
							where: { 'locationName': location.name }, // eslint-disable-line quote-props
							create: { 'locationName': location.name }, // eslint-disable-line quote-props
						},
					},
				})),
			}
			: undefined,
	};
	case 'stakeholder': return {
		stakeholderFullName: { set: data.title },
		stakeholderDescription: { set: data.description },
		stakeholderWikipediaUri: { set: data.wikipediaUri },
		documents:
			Array.isArray(data.stakeholderAuthoredDocuments)
				? {
					create: data.stakeholderAuthoredDocuments.map((document) => ({
						Document: {
							connect: {
								id: document.id,
							},
						},
					})),
				}
				: undefined,
		documentsMentionedIn:
			Array.isArray(data.documentsMentionedIn)
				? {
					create: data.documentsMentionedIn.map((document) => ({
						Document: {
							connect: {
								id: document.id,
							},
						},
					})),
				}
				: undefined,
		eventsInvolvedIn:
			Array.isArray(data.eventsInvolvedIn)
				? {
					create: data.eventsInvolvedIn.map((event) => ({
						Event: {
							connect: {
								id: event.id,
							},
						},
					})),
				}
				: undefined,
	};
	case 'location': return {
		locationName: { set: data.title },
		locationDescription: { set: data.description },
		locationWikipediaUri: { set: data.wikipediaUri },
		documentsMentionedIn:
			Array.isArray(data.documentsMentionedIn)
				? {
					create: data.documentsMentionedIn.map((document) => ({
						Document: {
							connect: {
								id: document.id,
							},
						},
					})),
				}
				: undefined,
		locationEvents:
			Array.isArray(data.eventsInvolvedIn)
				? {
					create: data.eventsInvolvedIn.map((event) => ({
						Event: {
							connect: {
								id: event.id,
							},
						},
					})),
				}
				: undefined,
	};
	default: return '';
	}
};

const getItemMutation = (itemType) => {
	switch (itemType) {
	case 'document': return DOCUMENT_MUTATION;
	case 'event': return EVENT_MUTATION;
	case 'stakeholder': return STAKEHOLDER_MUTATION;
	case 'location': return LOCATION_MUTATION;
	default: return '';
	}
};

const getMutationCallback = (props) => ({
	errors,
}) => {
	let { itemType } = props;
	if (props.itemType === 'stakeholder') itemType = 'protagonist';
	const urlString = `/${itemType}/context/${props.id}`;
	if (errors) {
		props.setErrors(errors);
		return;
	}
	props.history.push(urlString);
	props.history.go(0);
};

const getItemDeletion = (itemType) => {
	switch (itemType) {
	case 'document': return DOCUMENT_DELETION;
	case 'event': return EVENT_DELETION;
	case 'stakeholder': return STAKEHOLDER_DELETION;
	case 'location': return LOCATION_DELETION;
	default: return '';
	}
};

const getDeletionCallback = (props) => ({
	errors,
}) => {
	if (errors) {
		props.setErrors(errors);
		return;
	}
	props.history.push('/');
	props.history.go(0);
};


export default compose(
	withApollo,
	withRouter,
	withLoading,
	withState('data', 'setData', {}),
	withState('errors', 'setErrors', []),
	withState('specialInputState', 'setSpecialInputState', { addingTag: '', tagInputState: '' }),
	withHandlers({
		onSubmit(props) {
			props.startLoading();
			return (values) => {
				props.client.mutate({
					mutation: getItemMutation(props.itemType),
					variables: {
						id: props.id,
						data: getDestructuredData(values),
					},
				})
					.then((data) => {
						const mutationCallback = getMutationCallback(props);
						props.stopLoading();
						return mutationCallback(data);
					})
					.catch((err) => props.setErrors(err));
			};
		},
		handleDelete(props) {
			props.startLoading();
			return () => {
				props.client.mutate({
					mutation: getItemDeletion(props.itemType),
					variables: {
						id: props.id,
					},
				}).then((data) => {
					const deletionCallabck = getDeletionCallback(props);
					props.stopLoading();
					return deletionCallabck(data);
				}).catch((err) => {
					props.stopLoading();
					props.setErrors([err.message]);
				});
			};
		},
	}),
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
