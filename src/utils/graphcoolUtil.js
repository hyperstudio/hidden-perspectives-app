import { ucFirst } from './stringUtil';

export const formatGraphcoolEvent = ({
	id,
	eventTitle,
	eventStartDate,
	eventDescription,
	...rest
}) => ({
	...rest,
	id,
	title: eventTitle,
	date: new Date(eventStartDate),
	summary: eventDescription,
	type: 'Event',
});

export const formatGraphcoolDocument = ({
	id,
	documentTitle,
	documentCreationDate,
	documentDescription,
	documentKind,
	documentFiles,
	documentAuthors,
	...rest
}) => ({
	...rest,
	id,
	title: documentTitle,
	date: new Date(documentCreationDate),
	summary: documentDescription,
	type: ucFirst(documentKind[0].Kind.name),
	thumbnailUrl: documentFiles && documentFiles.length
		? documentFiles[0].File.url
		: undefined,
	authors: (documentAuthors || []).map((author) => ({
		id: author.Stakeholder.id,
		name: author.Stakeholder.stakeholderFullName,
	})),
});


