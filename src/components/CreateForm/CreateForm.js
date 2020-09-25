import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import {
	Switch,
} from '@smooth-ui/core-sc';
import isURL from 'validator/lib/isURL';
import { isAuthenticated, isAuthorized } from '../../utils/localStorageUtil';
import Button from '../_library/Button';
import MetadataRow from '../_library/MetadataRow';
import Headline from '../_library/Headline';
import Fieldset from '../_library/Fieldset';
import InputWrapper from '../_library/InputWrapper';
import DatePicker from '../_library/DatePicker';
import Select from '../_library/Select';
import Tag from '../_library/Tag';
import SearchInput from '../SearchInput';
import { isTodayOrPrior } from '../../utils/dateUtil';
import LoadingIndicator from '../LoadingIndicator';
import Errors from '../Errors';
import { LoadingContainer } from '../LoadingIndicator/styles';
import {
	ButtonsContainer,
	Container,
	Content,
	ControlFeedbackBlack,
	ProgressIndicator,
	RemoveButton,
	ScrollContainer,
	TagLikeContainer,
	TagsEditWrapper,
	StyledReactS3Uploader,
} from '../MetadataEditView/styles';
import { DNSAKindList, DNSAClassificationList } from '../../utils/listUtil';

const required = (value) => {
	const error = 'This field is required!';
	if (Array.isArray(value) && value.length === 0) return error;
	if (!value) return error;
	return undefined;
};

const isValidURL = (value) => {
	if (!value) return undefined;
	const error = 'This field must be a valid URL';
	return isURL(value) ? undefined : error;
};

const mustBeTodayOrPrior = (value) => {
	if (!value) return undefined;
	return isTodayOrPrior(!Number.isNaN(Date.parse(value)) ? new Date(`${value} 00:00`) : new Date(value)) ? undefined : 'The date must be prior or equal to today';
};

const mustBeTodayOrPriorAndRequired = (value) => {
	if (!value) return 'This field is required!';
	return isTodayOrPrior(!Number.isNaN(Date.parse(value)) ? new Date(`${value} 00:00`) : new Date(value)) ? undefined : 'The date must be prior or equal to today';
};

const getError = ({ error, touched }) => (touched && error ? error : undefined);
const isValid = ({ valid, touched }) => (!touched || valid);

const getMeta = (meta) => ({
	valid: isValid(meta),
	error: getError(meta),
});

const CreateForm = ({
	isLoading,
	onSubmit,
	errors,
	setErrors,
	progress,
	setProgress,
	itemType,
	removeText,
	specialInputState,
	setSpecialInputState,
}) => (
	<Container>
		<Errors errors={errors} />
		<LoadingContainer isLoading={isLoading}>
			<LoadingIndicator />
		</LoadingContainer>
		{!isLoading && isAuthenticated() && isAuthorized(['Editor', 'Admin']) && (
			<ScrollContainer>
				<Content>
					<Headline variant="h3" style={{ paddingBottom: '2rem' }}>
						Add a new
						{` ${itemType}`}
					</Headline>
					<Form
						onSubmit={onSubmit}
						mutators={{
							...arrayMutators,
						}}
						initialValues={{ itemType }}
						render={({
							handleSubmit,
							form: {
								mutators: { push },
							},
							submitting,
						}) => (
							<form onSubmit={handleSubmit}>
								<Fieldset title="Core Information" key="Core Information" mode="edit">
									{itemType === 'document' && (
										<MetadataRow
											label="ID"
											mode="edit"
										>
											<Field
												name="id"
												placeholder="e.g. uir009001"
												validate={required}
												render={(args) => (
													<>
														<InputWrapper
															name={args.input.name}
															placeholder="e.g. uir009001"
															value={args.input.value}
															onChange={args.input.onChange}
															onBlur={args.input.onBlur}
															label="ID"
															nolabel
															{...getMeta(args.meta)}
														/>
													</>
												)}
											/>
										</MetadataRow>
									)}
									<MetadataRow
										label={itemType === 'stakeholder' ? 'Name' : 'Title'}
										mode="edit"
									>
										<Field
											name="title"
											placeholder={itemType === 'stakeholder' ? 'Name' : 'Title'}
											validate={required}
											render={(args) => (
												<>
													<InputWrapper
														name={args.input.name}
														placeholder={itemType === 'stakeholder' ? 'Name' : 'Title'}
														value={args.input.value}
														onChange={args.input.onChange}
														onBlur={args.input.onBlur}
														label="Title"
														nolabel
														{...getMeta(args.meta)}
													/>
												</>
											)}
										/>
									</MetadataRow>
									<MetadataRow
										label={itemType === 'stakeholder' ? 'Description' : 'Summary'}
										mode="edit"
									>
										<Field
											name="description"
											placeholder={itemType === 'stakeholder' ? 'Description' : 'Summary'}
											validate={required}
											render={(args) => (
												<InputWrapper
													name={args.input.name}
													placeholder={itemType === 'stakeholder' ? 'Description' : 'Summary'}
													value={args.input.value}
													onChange={args.input.onChange}
													onBlur={args.input.onBlur}
													label="Summary"
													nolabel
													multiline
													{...getMeta(args.meta)}
												/>
											)}
										/>
									</MetadataRow>
									{itemType === 'document' && (
									<>
										<MetadataRow
											label="Authors"
											mode="edit"
										>
											<FieldArray
												name="authors"
												placeholder="Authors"
											>
												{({ fields }) => (
													<TagsEditWrapper type="authors">
														{fields.map((name, index) => (
															<div
																key={name}
																index={index}
															>
																<Field name={`${name}.name`}>
																	{// eslint-disable-next-line no-shadow
																		({ input: { name, value } }) => (
																			<Tag
																				name={name}
																			>
																				{value}
																				<RemoveButton
																					onClick={() => fields.remove(index)}
																					role="button"
																					aria-label="Remove"
																				>
																					{removeText}
																				</RemoveButton>
																			</Tag>
																		)
																	}
																</Field>
															</div>
														))}
														{specialInputState.addingTag !== 'authors' && (
															<TagLikeContainer
																interactive={specialInputState.addingTag !== 'authors'}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: 'authors' },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag === 'authors' && (
															<>
																<SearchInput
																	type="stakeholder"
																	name="author"
																	push={push}
																	specialInputState={specialInputState}
																	setSpecialInputState={setSpecialInputState}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedbackBlack valid>
																		Start typing a name, then select one from the list.
																	</ControlFeedbackBlack>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
										<MetadataRow
											label="Creation date"
											mode="edit"
										>
											<Field
												name="creationDate"
												placeholder="Creation date"
												validate={mustBeTodayOrPriorAndRequired}
											>
												{({ meta, input }) => (
													<InputWrapper
														label="Creation date"
														placeholder="YYYY-MM-DD"
														todayOrPrior
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => <DatePicker {...props} />}
													</InputWrapper>
												)}
											</Field>
										</MetadataRow>
										<MetadataRow
											label="Publication date"
											mode="edit"
										>
											<Field
												name="publicationDate"
												placeholder="Publication date"
												validate={mustBeTodayOrPrior}
											>
												{({ meta, input }) => (
													<InputWrapper
														label="Publication date"
														placeholder="YYYY-MM-DD"
														todayOrPrior
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => <DatePicker {...props} />}
													</InputWrapper>
												)}
											</Field>
										</MetadataRow>
									</>
									)}
									{itemType === 'event' && (
									<>
										<MetadataRow
											label="Start date"
											mode="edit"
										>
											<Field
												name="eventStartDate"
												placeholder="Start date"
												validate={mustBeTodayOrPriorAndRequired}
											>
												{({ meta, input }) => (
													<InputWrapper
														label="Start date"
														placeholder="YYYY-MM-DD"
														todayOrPrior
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => <DatePicker {...props} />}
													</InputWrapper>
												)}
											</Field>
										</MetadataRow>
										<MetadataRow
											label="End date"
											mode="edit"
										>
											<Field
												name="eventEndDate"
												placeholder="End date"
												validate={mustBeTodayOrPrior}
											>
												{({ meta, input }) => (
													<InputWrapper
														label="End date"
														placeholder="YYYY-MM-DD"
														todayOrPrior
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => <DatePicker {...props} />}
													</InputWrapper>
												)}
											</Field>
										</MetadataRow>
									</>
									)}
									{itemType === 'stakeholder' && (
										<>
											<MetadataRow
												label="Wikipedia URL"
												mode="edit"
											>
												<Field
													name="wikipediaUri"
													placeholder="Wikipedia URL"
													validate={isValidURL}
													render={(args) => (
														<InputWrapper
															name={args.input.name}
															placeholder="Wikipedia URL"
															value={args.input.value}
															onChange={args.input.onChange}
															onBlur={args.input.onBlur}
															label="Wikipedia URL"
															nolabel
															{...getMeta(args.meta)}
														/>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="Institution"
												mode="edit"
											>
												<TagsEditWrapper>
													<Field
														name="isStakeholderInstitution"
														type="checkbox"
														render={(args) => (
															<>
																<Switch
																	checked={args.input.checked}
																	onChange={args.input.onChange}
																	{...getMeta(args.meta)}
																/>
															</>
														)}
													/>
													<ControlFeedbackBlack valid>
														Is this an institution/organization? If so, flip this switch on.
														<br />
														If it is a single person, leave in the &ldquo;off&rdquo; position.
													</ControlFeedbackBlack>
												</TagsEditWrapper>
											</MetadataRow>
										</>
									)}
								</Fieldset>
								{itemType === 'stakeholder' && (
									<Fieldset title="Authored" key="Authored" mode="edit">
										<MetadataRow
											label="Documents"
											mode="edit"
										>
											<FieldArray
												name="stakeholderAuthoredDocuments"
												placeholder="Documents Authored By"
											>
												{({ fields }) => (
													<TagsEditWrapper type="documents">
														{fields.map((name, index) => (
															<div
																key={name}
																index={index}
															>
																<Field name={`${name}.name`}>
																	{// eslint-disable-next-line no-shadow
																		({ input: { name, value } }) => (
																			<Tag
																				name={name}
																				type="document"
																			>
																				{value}
																				<RemoveButton
																					onClick={() => fields.remove(index)}
																					role="button"
																					aria-label="Remove"
																				>
																					{removeText}
																				</RemoveButton>
																			</Tag>
																		)
																	}
																</Field>
															</div>
														))}
														{specialInputState.addingTag !== 'stakeholderAuthoredDocuments' && (
															<TagLikeContainer
																interactive={specialInputState.addingTag !== 'stakeholderAuthoredDocuments'}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: 'stakeholderAuthoredDocuments' },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag === 'stakeholderAuthoredDocuments' && (
															<>
																<SearchInput
																	type="document"
																	name="stakeholderAuthoredDocuments"
																	push={push}
																	specialInputState={specialInputState}
																	setSpecialInputState={setSpecialInputState}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedbackBlack valid>
																		Start typing a document name, then select one from the list.
																	</ControlFeedbackBlack>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
									</Fieldset>
								)}
								<Fieldset title="Appearances" key="Appearances" mode="edit">
									{(itemType === 'document' || itemType === 'event') && (
									<>
										<MetadataRow
											label="Stakeholders"
											mode="edit"
										>
											<FieldArray
												name="stakeholders"
												placeholder="Stakeholders"
											>
												{({ fields }) => (
													<TagsEditWrapper type="stakeholders">
														{fields.map((name, index) => (
															<div
																key={name}
																index={index}
															>
																<Field name={`${name}.name`}>
																	{// eslint-disable-next-line no-shadow
																		({ input: { name, value } }) => (
																			<Tag
																				name={name}
																			>
																				{value}
																				<RemoveButton
																					onClick={() => fields.remove(index)}
																					role="button"
																					aria-label="Remove"
																				>
																					{removeText}
																				</RemoveButton>
																			</Tag>
																		)
																	}
																</Field>
															</div>
														))}
														{specialInputState.addingTag !== 'stakeholders' && (
															<TagLikeContainer
																interactive={specialInputState.addingTag !== 'stakeholders'}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: 'stakeholders' },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag === 'stakeholders' && (
															<>
																<SearchInput
																	type="stakeholder"
																	name="stakeholder"
																	push={push}
																	specialInputState={specialInputState}
																	setSpecialInputState={setSpecialInputState}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedbackBlack valid>
																		Start typing a name, then select one from the list.
																	</ControlFeedbackBlack>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
										<MetadataRow
											label="Locations"
											mode="edit"
										>
											<FieldArray
												name="locations"
												placeholder="Locations"
											>
												{({ fields }) => (
													<TagsEditWrapper>
														{fields.map((name, index) => (
															<div
																key={name}
																index={index}
															>
																<Field name={`${name}.name`}>
																	{// eslint-disable-next-line no-shadow
																		({ input: { name, value } }) => (
																			<Tag name={name}>
																				{value}
																				<RemoveButton
																					onClick={() => fields.remove(index)}
																					role="button"
																					aria-label="Remove"
																				>
																					{removeText}
																				</RemoveButton>
																			</Tag>
																		)
																	}
																</Field>
															</div>
														))}
														{specialInputState.addingTag !== 'locations' && (
															<TagLikeContainer
																interactive={specialInputState.addingTag !== 'locations'}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: 'locations' },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag === 'locations' && (
															<>
																<SearchInput
																	type="location"
																	name="location"
																	push={push}
																	specialInputState={specialInputState}
																	setSpecialInputState={setSpecialInputState}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedbackBlack valid>
																		Start typing a location, then select one from the list,
																		or press ENTER to create a new location.
																	</ControlFeedbackBlack>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
									</>
									)}
									{(itemType === 'stakeholder' || itemType === 'location') && (
									<>
										<MetadataRow
											label="Documents"
											mode="edit"
										>
											<FieldArray
												name="documentsMentionedIn"
												placeholder="Documents Mentioned In"
											>
												{({ fields }) => (
													<TagsEditWrapper type="documents">
														{fields.map((name, index) => (
															<div
																key={name}
																index={index}
															>
																<Field name={`${name}.name`}>
																	{// eslint-disable-next-line no-shadow
																		({ input: { name, value } }) => (
																			<Tag
																				name={name}
																				type="document"
																			>
																				{value}
																				<RemoveButton
																					onClick={() => fields.remove(index)}
																					role="button"
																					aria-label="Remove"
																				>
																					{removeText}
																				</RemoveButton>
																			</Tag>
																		)
																	}
																</Field>
															</div>
														))}
														{specialInputState.addingTag !== 'documentsMentionedIn' && (
															<TagLikeContainer
																interactive={specialInputState.addingTag !== 'documentsMentionedIn'}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: 'documentsMentionedIn' },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag === 'documentsMentionedIn' && (
															<>
																<SearchInput
																	type="document"
																	name="documentsMentionedIn"
																	push={push}
																	specialInputState={specialInputState}
																	setSpecialInputState={setSpecialInputState}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedbackBlack valid>
																		Start typing a document name, then select one from the list.
																	</ControlFeedbackBlack>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
										<MetadataRow
											label="Events"
											mode="edit"
										>
											<FieldArray
												name="eventsInvolvedIn"
												placeholder="Events"
											>
												{({ fields }) => (
													<TagsEditWrapper type="events">
														{fields.map((name, index) => (
															<div
																key={name}
																index={index}
															>
																<Field name={`${name}.name`}>
																	{// eslint-disable-next-line no-shadow
																		({ input: { name, value } }) => (
																			<Tag
																				name={name}
																				type="event"
																			>
																				{value}
																				<RemoveButton
																					onClick={() => fields.remove(index)}
																					role="button"
																					aria-label="Remove"
																				>
																					{removeText}
																				</RemoveButton>
																			</Tag>
																		)
																	}
																</Field>
															</div>
														))}
														{specialInputState.addingTag !== 'eventsInvolvedIn' && (
															<TagLikeContainer
																interactive={specialInputState.addingTag !== 'eventsInvolvedIn'}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: 'eventsInvolvedIn' },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag === 'eventsInvolvedIn' && (
															<>
																<SearchInput
																	type="event"
																	name="eventsInvolvedIn"
																	push={push}
																	specialInputState={specialInputState}
																	setSpecialInputState={setSpecialInputState}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedbackBlack valid>
																		Start typing an event name, then select one from the list.
																	</ControlFeedbackBlack>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
									</>
									)}
								</Fieldset>
								{(itemType === 'document' || itemType === 'event') && (
									<Fieldset title="Categorization" key="Categorization" mode="edit">
										{itemType === 'document' && (
										<>
											<MetadataRow
												label="Kind"
												mode="edit"
											>
												<Field
													name="kind"
													placeholder="Kind"
													validate={required}
												>
													{({ input, meta }) => (
														<InputWrapper
															label="Kind"
															{...getMeta(meta)}
															placeholder="Select a kind"
															nolabel
															options={DNSAKindList}
															{...input}
														>
															{(props) => <Select {...props} />}
														</InputWrapper>
													)}
												</Field>
											</MetadataRow>
											<MetadataRow
												label="Classification"
												mode="edit"
											>
												<Field
													name="classification"
													placeholder="Classification"
													validate={required}
												>
													{({ input, meta }) => (
														<InputWrapper
															label="Classification"
															{...getMeta(meta)}
															placeholder="Select a classification"
															nolabel
															options={DNSAClassificationList}
															{...input}
														>
															{(props) => <Select {...props} />}
														</InputWrapper>
													)}
												</Field>
											</MetadataRow>
										</>
										)}
										<MetadataRow
											label="Tags"
											mode="edit"
										>
											<FieldArray
												name="tags"
												placeholder="Tags"
											>
												{({ fields }) => (
													<TagsEditWrapper>
														{fields.map((name, index) => (
															<div
																key={name}
																index={index}
															>
																<Field name={`${name}.name`}>
																	{// eslint-disable-next-line no-shadow
																		({ input: { name, value } }) => (
																			<Tag name={name}>
																				{value}
																				<RemoveButton
																					onClick={() => fields.remove(index)}
																					role="button"
																					aria-label="Remove"
																				>
																					{removeText}
																				</RemoveButton>
																			</Tag>
																		)
																	}
																</Field>
															</div>
														))}
														{specialInputState.addingTag !== 'tags' && (
															<TagLikeContainer
																interactive={specialInputState.addingTag !== 'tags'}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: 'tags' },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag === 'tags' && (
															<>
																<SearchInput
																	type="tag"
																	name="tag"
																	push={push}
																	specialInputState={specialInputState}
																	setSpecialInputState={setSpecialInputState}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedbackBlack valid>
																		Start typing a tag, then select one from the list,
																		or press ENTER to create a new tag.
																	</ControlFeedbackBlack>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
									</Fieldset>
								)}
								{itemType === 'document' && (
									<>
										<Fieldset title="Content" key="Content" mode="edit">
											<MetadataRow label="File" mode="edit">
												<Field name="documentFiles">
													{({ input: { value, onChange, ...input } }) => (
														<>
															<StyledReactS3Uploader
																signingUrl="https://d1n5c6z5w87l9z.cloudfront.net/url"
																name="documentFiles"
																signingUrlMethod="GET"
																accept="application/pdf"
																s3path="newuploads/"
																disabled={progress.started}
																onProgress={
																	(percent, status) => setProgress(
																		{ started: true, percent, status },
																	)
																}
																onError={((status) => setErrors([status]))}
																onFinish={(signRes, file) => {
																	const fileUrl = signRes.signedUrl.substring(
																		0, signRes.signedUrl.indexOf(file.name),
																	);
																	const fileObj = {
																		name: file.name,
																		size: file.size,
																		contentType: file.type,
																		url: `${fileUrl}${file.name}`,
																	};
																	return onChange([fileObj]);
																}}
																uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}
																scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/ig, '')}
																{...input}
															/>
															{progress.started && (
																<TagsEditWrapper>
																	<ProgressIndicator percent={progress.percent} />
																	<ControlFeedbackBlack valid>
																		{progress.percent}
																		%:
																		{' '}
																		{progress.status}
																	</ControlFeedbackBlack>
																</TagsEditWrapper>
															)}
														</>
													)}
												</Field>
											</MetadataRow>
											<MetadataRow label="Transcript" mode="edit">
												<Field
													name="documentTranscript"
													placeholder="Transcript"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="Paste transcript here"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="Transcript"
																nolabel
																multiline
																monospace="true"
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
										</Fieldset>
										<Fieldset title="DNSA fields" key="DNSA" mode="edit">
											If this document exists in the Digital National Security Archive,
											complete these fields accordingly. Otherwise, you may leave them blank.
											<br />
											<br />
											<MetadataRow
												label="Item Number"
												mode="edit"
											>
												<Field
													name="dnsaItemNumber"
													placeholder="Item Number"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="Item Number"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="Item Number"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="Citation"
												mode="edit"
											>
												<Field
													name="dnsaCitation"
													placeholder="Citation"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="Citation"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="Citation"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="Abstract"
												mode="edit"
											>
												<Field
													name="dnsaAbstract"
													placeholder="Abstract"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="Abstract"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="Abstract"
																multiline
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="Collection"
												mode="edit"
											>
												<Field
													name="dnsaCollection"
													placeholder="Collection"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="Collection"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="Collection"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="From"
												mode="edit"
											>
												<Field
													name="dnsaFrom"
													placeholder="From"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="From"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="From"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="To"
												mode="edit"
											>
												<Field
													name="dnsaTo"
													placeholder="To"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="To"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="To"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="Subject"
												mode="edit"
											>
												<Field
													name="dnsaSubject"
													placeholder="Subject"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="Subject"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="Subject"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="Origin"
												mode="edit"
											>
												<Field
													name="dnsaOrigin"
													placeholder="Origin"
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="Origin"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="Origin"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
											<MetadataRow
												label="URL"
												mode="edit"
											>
												<Field
													name="dnsaURL"
													placeholder="URL"
													validate={isValidURL}
													render={(args) => (
														<>
															<InputWrapper
																name={args.input.name}
																placeholder="URL"
																value={args.input.value}
																onChange={args.input.onChange}
																onBlur={args.input.onBlur}
																label="URL"
																nolabel
																{...getMeta(args.meta)}
															/>
														</>
													)}
												/>
											</MetadataRow>
										</Fieldset>
									</>
								)}
								<ButtonsContainer>
									<Button
										to="/"
										disabled={submitting || isLoading}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										primary
										disabled={submitting || isLoading}
									>
										Submit
									</Button>
								</ButtonsContainer>
							</form>
						)}
					/>
				</Content>
			</ScrollContainer>
		)}
		{!isLoading && (!isAuthenticated() || !isAuthorized(['Editor', 'Admin'])) && (
			<ScrollContainer>
				<Content style={{ textAlign: 'center' }}>
					You do not have permission to view this page.
				</Content>
			</ScrollContainer>
		)}
	</Container>
);

CreateForm.propTypes = {
	itemType: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
	setSpecialInputState: PropTypes.func.isRequired,
	specialInputState: PropTypes.shape({
		addingTag: PropTypes.string,
		tagInputState: PropTypes.string,
	}),
	onSubmit: PropTypes.func.isRequired,
	errors: PropTypes.arrayOf(PropTypes.string.isRequired),
	setErrors: PropTypes.func.isRequired,
	progress: PropTypes.shape({
		started: PropTypes.bool,
		percent: PropTypes.number,
		status: PropTypes.string,
	}),
	setProgress: PropTypes.func.isRequired,
	removeText: PropTypes.string,
};

CreateForm.defaultProps = {
	isLoading: true,
	errors: [],
	progress: {},
	removeText: '✕',
	specialInputState: { addingTag: '', tagInputState: '' },
};

export default CreateForm;
