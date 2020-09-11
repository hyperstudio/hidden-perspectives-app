import { withRouter } from 'react-router-dom';
import {
	compose,
	lifecycle,
	withState,
	withHandlers,
} from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withLoading } from '../../utils/hocUtil';
import CreateForm from './CreateForm';
import { ucFirst } from '../../utils/stringUtil';

const CREATE_DOCUMENT_MUTATION = gql`
	mutation CreateDocument($data: DocumentCreateInput!){
		createOneDocument(data: $data) {
			documentTitle
			documentDescription
			documentCreationDate
			documentPublicationDate
			documentOriginalID
			documentFiles {
				File {
					id
				}
			}
			documentTranscript
			documentKind {
				Kind {
					id
				}
			}
			documentAuthors {
				Stakeholder {
					id
				}
			}
			mentionedStakeholders {
				Stakeholder {
					id
				}
			}
			mentionedLocations {
				Location {
					id
				}
			}
			documentTags {
				Tag{
					id
				}											
			}
			dnsaAbstract
			dnsaCitation
			dnsaCollection
			dnsaFrom
			dnsaItemNumber
			dnsaOrigin
			dnsaStakeholder
			dnsaSubject
			dnsaTo
			dnsaURL
		}
	}
`;

// const EVENT_QUERY = gql`
// 	query GetEvent($id: String) {
// 		event(where: {id: $id}) {
// 			id
// 			eventTitle
// 			eventDescription
// 			eventStartDate
// 			eventEndDate
// 			eventStakeholders {
// 				Stakeholder{
// 					id
// 					stakeholderFullName
// 				}
// 			}
// 			eventTags {
// 				Tag {
// 					id,
// 					name
// 				}
// 			}
// 			eventLocations {
// 				Location{
// 					id,
// 					locationName
// 				}
// 			}
// 		}
// 	}
// `;

// const STAKEHOLDER_QUERY = gql`
// 	query GetStakeholder($id: String) {
// 		stakeholder(where: {id: $id}) {
// 			id
// 			documents {
// 				Document{
// 					id
// 					documentTitle
// 				}
// 			}
// 			documentsMentionedIn {
// 				Document{
// 					id
// 					documentTitle
// 				}
// 			}
// 			eventsInvolvedIn {
// 				Event {
// 					id
// 					eventTitle
// 				}
// 			}
// 			stakeholderDescription
// 			stakeholderFullName
// 			stakeholderWikipediaUri
// 		}
// 	}
// `;

// const LOCATION_QUERY = gql`
// 	query GetLocation($id: String) {
// 		location(where: {id: $id}) {
// 			id
// 			documentsMentionedIn {
// 				Document{
// 					id
// 					documentTitle
// 				}
// 			}
// 			locationEvents {
// 				Event {
// 					id
// 					eventTitle
// 				}
// 			}
// 			locationDescription
// 			locationName
// 			locationWikipediaUri
// 		}
// 	}
// `;

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

const getCreateItemMutation = (itemType) => {
	switch (itemType) {
	case 'document': return CREATE_DOCUMENT_MUTATION;
	// case 'event': return EVENT_MUTATION;
	// case 'stakeholder': return STAKEHOLDER_MUTATION;
	// case 'location': return LOCATION_MUTATION;
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
	props.history.push(urlString, { alerts: [{ message: `${ucFirst(itemType)} edited successfully.`, variant: 'success' }] });
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
					mutation: getCreateItemMutation(props.itemType),
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
	}),
	lifecycle({
		componentDidMount() {
			this.props.stopLoading();
		},
	}),
)(CreateForm);
