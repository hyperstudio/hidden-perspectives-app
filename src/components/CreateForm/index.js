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

const CREATE_EVENT_MUTATION = gql`
	query CreateEvent($data: EventCreateInput!) {
		createOneEvent(data: $data) {
			id
			eventTitle
			eventDescription
			eventStartDate
			eventEndDate
			eventStakeholders {
				Stakeholder{
					id
				}
			}
			eventTags {
				Tag {
					id
				}
			}
			eventLocations {
				Location{
					id
				}
			}
		}
	}
`;

const CREATE_STAKEHOLDER_MUTATION = gql`
mutation CreateStakeholder($data: StakeholderCreateInput!){
		createOneStakeholder(data: $data) {
			id
			stakeholderDescription
			stakeholderFullName
			stakeholderWikipediaUri
			isStakeholderInstitution
			documents {
				Document{
					id
				}
			}
			documentsMentionedIn {
				Document{
					id
				}
			}
			eventsInvolvedIn {
				Event {
					id
				}
			}
		}
	}
`;

const dateExists = (date) => date && date !== '' && date !== null;

const getDestructuredData = (data) => {
	switch (data.itemType) {
	case 'document': return {
		documentTitle: data.title,
		documentDescription: data.description,
		documentCreationDate: dateExists(data.creationDate) ? new Date(`${data.creationDate} 00:00`) : undefined,
		documentPublicationDate: dateExists(data.publicationDate) ? new Date(`${data.publicationDate} 00:00`) : undefined,
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
		eventTitle: data.title,
		eventDescription: data.description,
		eventStartDate: dateExists(data.eventStartDate) ? new Date(`${data.eventStartDate} 00:00`) : undefined,
		eventEndDate: dateExists(data.eventEndDate) ? new Date(`${data.eventEndDate} 00:00`) : undefined,
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
		stakeholderFullName: data.title,
		stakeholderDescription: data.description,
		stakeholderWikipediaUri: data.wikipediaUri,
		isStakeholderInstitution: data.isStakeholderInstitution ? 1 : 0,
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
	default: return '';
	}
};

const getCreateItemMutation = (itemType) => {
	switch (itemType) {
	case 'document': return CREATE_DOCUMENT_MUTATION;
	case 'event': return CREATE_EVENT_MUTATION;
	case 'stakeholder': return CREATE_STAKEHOLDER_MUTATION;
	default: return '';
	}
};

const getMutationCallback = (props) => ({
	data,
	errors,
}) => {
	const { itemType } = props;
	let urlString = '';
	switch (itemType) {
	case 'document': urlString = `/document/context/${data.createOneDocument.id}`; break;
	case 'stakeholder': urlString = `/protagonist/context/${data.createOneStakeholder.id}`; break;
	case 'event': urlString = `/event/context/${data.createOneEvent.id}`; break;
	default: break;
	}
	if (errors) {
		props.setErrors(errors);
	}
	props.history.push(urlString, { alerts: [{ message: `${ucFirst(itemType)} added successfully.`, variant: 'success' }] });
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
						data: getDestructuredData(values),
					},
				})
					.then((data) => {
						const mutationCallback = getMutationCallback(props);
						props.stopLoading();
						return mutationCallback(data);
					})
					.catch((err) => {
						props.stopLoading();
						props.setErrors([err.message]);
					});
			};
		},
	}),
	lifecycle({
		componentDidMount() {
			this.props.stopLoading();
		},
	}),
)(CreateForm);
