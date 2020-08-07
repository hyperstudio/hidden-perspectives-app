import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import isURL from 'validator/lib/isURL';
import MetadataRow from '../_library/MetadataRow';
import Fieldset from '../_library/Fieldset';
import InputWrapper from '../_library/InputWrapper';
import DatePicker from '../_library/DatePicker';
import Select from '../_library/Select';
import { isTodayOrPrior } from '../../utils/dateUtil';
import LoadingIndicator from '../LoadingIndicator';
import Errors from '../Errors';
import { LoadingContainer } from '../LoadingIndicator/styles';
import { Container, Content, ScrollContainer } from './styles';
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

const onSubmit = async (values) => values;

const MetadataEditView = ({
	data,
	isLoading,
	errors,
	itemType,
}) => (
	<Container>
		<Errors errors={errors} />
		<LoadingContainer isLoading={isLoading}>
			<LoadingIndicator />
		</LoadingContainer>
		<ScrollContainer>
			<Content>
				<Form
					onSubmit={onSubmit}
					initialValues={data}
					render={({
						handleSubmit,
						form,
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
											<Field
												name="authors"
												placeholder="Authors"
												component="div"
											/>
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
											component="div"
										/>
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
											<Field
												name="stakeholders"
												placeholder="Stakeholders"
												component="div"
											/>
										</MetadataRow>
										<MetadataRow
											label="Locations"
											mode="edit"
										>
											<Field
												name="locations"
												placeholder="Locations"
												component="div"
											/>
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
												component="div"
											/>
										</MetadataRow>
										<MetadataRow
											label="Events"
											mode="edit"
										>
											<Field
												name="eventsInvolvedIn"
												placeholder="Events"
												component="div"
											/>
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
										<Field
											name="tags"
											placeholder="Tags"
											component="div"
										/>
									</MetadataRow>
								</Fieldset>
							)}
						</form>
					)}
				/>
			</Content>
		</ScrollContainer>
	</Container>
);

MetadataEditView.propTypes = {
	itemType: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
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
	errors: Errors.propTypes.errors,
};

MetadataEditView.defaultProps = {
	isLoading: true,
	data: {},
	errors: Errors.defaultProps.errors,
};

export default MetadataEditView;
