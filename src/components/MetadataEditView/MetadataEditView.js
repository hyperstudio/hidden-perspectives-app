import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import {
	Alert,
	ControlFeedback,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalDialog,
	ModalFooter,
	ModalHeader,
	Typography,
} from '@smooth-ui/core-sc';
import isURL from 'validator/lib/isURL';
import { isAuthenticated, isAuthorized } from '../../utils/localStorageUtil';
import Button from '../_library/Button';
import MetadataRow from '../_library/MetadataRow';
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
	RemoveButton,
	ScrollContainer,
	TagLikeContainer,
	TagsEditWrapper,
} from './styles';
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

const MetadataEditView = ({
	data,
	isLoading,
	onSubmit,
	handleDelete,
	errors,
	toggled,
	onToggle,
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
		{!isLoading && isAuthenticated && isAuthorized(['Editor', 'Admin']) && (
			<ScrollContainer>
				<Content>
					<Form
						onSubmit={onSubmit}
						mutators={{
							...arrayMutators,
						}}
						initialValues={{ ...data, itemType }}
						render={({
							handleSubmit,
							form: {
								mutators: { push },
							},
							submitting,
						}) => (
							<form onSubmit={handleSubmit}>
								<Fieldset title="Core Information" key="Core Information" mode="edit">
									<MetadataRow
										label="Title"
										mode="edit"
									>
										<Field
											name="title"
											placeholder="Title"
											validate={required}
											render={(args) => (
												<>
													<InputWrapper
														name={args.input.name}
														placeholder="Title"
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
										label="Summary"
										mode="edit"
									>
										<Field
											name="description"
											placeholder="Summary"
											validate={required}
											render={(args) => (
												<InputWrapper
													name={args.input.name}
													placeholder="Summary"
													value={args.input.value}
													onChange={args.input.onChange}
													onBlur={args.input.onBlur}
													label="Title"
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
									{(itemType === 'stakeholder' || itemType === 'location') && (
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
								<Fieldset title="Admin" key="Admin" mode="edit">
									<MetadataRow
										label={`Delete this ${itemType}`}
										mode="edit"
									>
										<TagsEditWrapper>
											<Button
												danger
												type="button"
												onClick={(evt) => {
													evt.preventDefault();
													return onToggle(true);
												}}
											>
												Delete this
												{` ${itemType}`}
											</Button>
											<Modal opened={toggled} onClose={() => (onToggle(false))}>
												<ModalDialog>
													<ModalContent>
														<ModalCloseButton />
														<ModalHeader>
															<Typography variant="h5" m={0}>
																{`Delete ${itemType}`}
															</Typography>
														</ModalHeader>
														<ModalBody>
															Are you sure you want to delete this
															{` ${itemType}`}
															? This action cannot be undone.
														</ModalBody>
														<ModalFooter>
															<Button
																type="button"
																danger
																onClick={(evt) => {
																	evt.preventDefault();
																	handleDelete();
																}}
															>
																{`Delete ${itemType}`}
															</Button>
															<Button type="button" onClick={(evt) => { evt.preventDefault(); return onToggle(false); }}>
																Cancel
															</Button>
														</ModalFooter>
													</ModalContent>
												</ModalDialog>
											</Modal>
											<ControlFeedback style={{ marginTop: '1rem' }} valid={false}>
												Clicking this button will permanently delete this
												{` ${itemType} `}
												from the database. Any archive entries connected to it will lose
												{' '}
												that connection, but will otherwise remain unchanged.
											</ControlFeedback>
										</TagsEditWrapper>
									</MetadataRow>
								</Fieldset>
								{errors.map(({ message }) => (
									<Alert key={message} variant="danger">{message}</Alert>
								))}
								<ButtonsContainer>
									<Button
										to={itemType === 'stakeholder' ? `/protagonist/context/${data.id}` : `/${itemType}/context/${data.id}`}
										disabled={submitting || isLoading}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										primary
										disabled={submitting || isLoading}
									>
										Save changes
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

MetadataEditView.propTypes = {
	itemType: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
	setSpecialInputState: PropTypes.func.isRequired,
	specialInputState: PropTypes.shape({
		addingTag: PropTypes.string,
		tagInputState: PropTypes.string,
	}),
	onSubmit: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
	toggled: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	data: PropTypes.shape({
		id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		authors: PropTypes.array,
		creationDate: PropTypes.string,
		publicationDate: PropTypes.string,
		stakeholders: PropTypes.array,
		locations: PropTypes.array,
		kind: PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
		}),
		classification: PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
		}),
		tags: PropTypes.array,
	}),
	errors: PropTypes.arrayOf(PropTypes.shape({
		message: PropTypes.string.isRequired,
	})),
	removeText: PropTypes.string,
};

MetadataEditView.defaultProps = {
	isLoading: true,
	data: {},
	errors: [],
	removeText: '✕',
	specialInputState: { addingTag: '', tagInputState: '' },
};

export default MetadataEditView;
