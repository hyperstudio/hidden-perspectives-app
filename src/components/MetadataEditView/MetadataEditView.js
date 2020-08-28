import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Alert, ControlFeedback } from '@smooth-ui/core-sc';
import isURL from 'validator/lib/isURL';
import Button from '../_library/Button';
import MetadataRow from '../_library/MetadataRow';
import Fieldset from '../_library/Fieldset';
import InputWrapper from '../_library/InputWrapper';
import DatePicker from '../_library/DatePicker';
import Select from '../_library/Select';
import Stakeholder from '../_library/Stakeholder';
import Item from '../_library/Item';
import Tag from '../_library/Tag';
import SearchInput from '../SearchInput';
import { isTodayOrPrior } from '../../utils/dateUtil';
import LoadingIndicator from '../LoadingIndicator';
import Errors from '../Errors';
import { LoadingContainer } from '../LoadingIndicator/styles';
import {
	AlertsContainer,
	Container,
	Content,
	RemoveButton,
	ScrollContainer,
	TagLikeContainer,
	TagsEditWrapper,
	TagsInput,
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
	errors,
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
		{!isLoading && (
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
										{process.env.ENABLE_SEARCH_INPUTS && (
											<MetadataRow
												label="Authors"
												mode="edit"
											>
												<Field
													name="authors"
													placeholder="Authors"
												>
													{({ input, meta }) => (
														<InputWrapper
															label="Authors"
															placeholder="Add authors"
															nolabel
															{...getMeta(meta)}
															{...input}
														>
															{() => (
																<SearchInput
																	type="stakeholder"
																	name="documentAuthors"
																	onChange={input.onChange}
																>
																	{() => (
																		Array.isArray(input.value) ? input.value.map((author) => (
																			<Stakeholder
																				id={author.id}
																				value={author.name}
																				key={author.name}
																				itemType="protagonist"
																			>
																				{author.name}
																			</Stakeholder>
																		))
																			: <div />
																	)}
																</SearchInput>
															)}
														</InputWrapper>
													)}
												</Field>
											</MetadataRow>
										)}
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
										<MetadataRow
											label="Wikipedia URL"
											mode="edit"
										>
											<Field
												name="stakeholderWikipediaUri"
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
											<Field
												name="stakeholderAuthoredDocuments"
												placeholder="Documents"
											>
												{({ input, meta }) => (
													<InputWrapper
														label="Documents"
														placeholder="Add documents"
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => (
															Array.isArray(input.value) ? input.value.map((document) => (
																<Item
																	itemType="document"
																	key={document.name}
																	value={document.name}
																	{...props}
																>
																	{document.name}
																</Item>
															))
																: <div />
														)}
													</InputWrapper>
												)}
											</Field>
										</MetadataRow>
									</Fieldset>
								)}
								<Fieldset title="Appearances" key="Appearances" mode="edit">
									{(itemType === 'document' || itemType === 'event') && (
									<>
										{process.env.ENABLE_SEARCH_INPUTS && (
											<MetadataRow
												label="Stakeholders"
												mode="edit"
											>
												<Field
													name="stakeholders"
													placeholder="Stakeholders"
												>
													{({ input, meta }) => (
														<InputWrapper
															label="Stakeholders"
															placeholder="Add stakeholders"
															nolabel
															{...getMeta(meta)}
															{...input}
														>
															{() => (
																<SearchInput
																	type="stakeholder"
																	name="documentInvolvedStakeholders"
																	onChange={input.onChange}
																>
																	{() => (
																		Array.isArray(input.value) ? input.value.map((stakeholder) => (
																			<Stakeholder
																				id={stakeholder.id}
																				value={stakeholder.name}
																				key={stakeholder.name}
																				itemType="protagonist"
																			>
																				{stakeholder.name}
																			</Stakeholder>
																		))
																			: <div />
																	)}
																</SearchInput>
															)}
														</InputWrapper>
													)}
												</Field>
											</MetadataRow>
										)}
										<MetadataRow
											label="Locations"
											mode="edit"
										>
											<Field
												name="locations"
												placeholder="Locations"
											>
												{({ input, meta }) => (
													<InputWrapper
														label="Locations"
														placeholder="Add locations"
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => (
															Array.isArray(input.value) ? input.value.map((location) => (
																<Item
																	itemType="location"
																	key={location.name}
																	value={location.name}
																	{...props}
																>
																	{location.name}
																</Item>
															))
																: <div />
														)}
													</InputWrapper>
												)}
											</Field>
										</MetadataRow>
									</>
									)}
									{(itemType === 'stakeholder' || itemType === 'location') && (
									<>
										<MetadataRow
											label="Documents"
											mode="edit"
										>
											<Field
												name="documentsMentionedIn"
												placeholder="Documents"
											>
												{({ input, meta }) => (
													<InputWrapper
														label="Documents"
														placeholder="Add documents"
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => (
															Array.isArray(input.value) ? input.value.map((document) => (
																<Item
																	itemType="document"
																	key={document.name}
																	value={document.name}
																	{...props}
																>
																	{document.name}
																</Item>
															))
																: <div />
														)}
													</InputWrapper>
												)}
											</Field>
										</MetadataRow>
										<MetadataRow
											label="Events"
											mode="edit"
										>
											<Field
												name="eventsInvolvedIn"
												placeholder="Events"
											>
												{({ input, meta }) => (
													<InputWrapper
														label="Events"
														placeholder="Add events"
														nolabel
														{...getMeta(meta)}
														{...input}
													>
														{(props) => (
															Array.isArray(input.value) ? input.value.map((event) => (
																<Item
																	itemType="event"
																	key={event.name}
																	value={event.name}
																	{...props}
																>
																	{event.name}
																</Item>
															))
																: <div />
														)}
													</InputWrapper>
												)}
											</Field>
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
														{!specialInputState.addingTag && (
															<TagLikeContainer
																interactive={!specialInputState.addingTag}
																type="button"
																onClick={
																	() => setSpecialInputState(
																		{ ...specialInputState, addingTag: true },
																	)
																}
															>
																+
															</TagLikeContainer>
														)}
														{specialInputState.addingTag && (
															<>
																<TagsInput
																	type="text"
																	placeholder="Enter tag"
																	onKeyDown={(evt) => {
																		if (evt.key === 'Tab' && specialInputState.tagInputState !== '') {
																			push('tags', { name: specialInputState.tagInputState, value: specialInputState.tagInputState });
																			setSpecialInputState(
																				{ ...specialInputState, addingTag: false, tagInputState: '' },
																			);
																		}
																	}}
																	value={specialInputState.tagInputState}
																	onChange={(evt) => {
																		setSpecialInputState(
																			{ ...specialInputState, tagInputState: evt.target.value },
																		);
																	}}
																/>
																{specialInputState.tagInputState === '' && (
																	<ControlFeedback valid={false}>
																		Start typing a tag, then select one from the list,
																		or press TAB to create a new tag.
																	</ControlFeedback>
																)}
															</>
														)}
													</TagsEditWrapper>
												)}
											</FieldArray>
										</MetadataRow>
									</Fieldset>
								)}
								<AlertsContainer>
									{errors.map(({ message }) => (
										<Alert key={message} variant="danger">{message}</Alert>
									))}
								</AlertsContainer>
								<Button
									type="submit"
									alignSelf="flex-end"
									disabled={submitting || isLoading}
								>
									Submit
								</Button>
								<>
									<pre>{JSON.stringify(data, null, '\t')}</pre>
								</>
							</form>
						)}
					/>
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
		addingTag: PropTypes.bool,
		tagInputState: PropTypes.string,
	}),
	onSubmit: PropTypes.func.isRequired,
	data: PropTypes.shape({
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
	specialInputState: { addingTag: false, tagInputState: '' },
};

export default MetadataEditView;
