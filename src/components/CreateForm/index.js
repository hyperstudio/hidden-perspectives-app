import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Grid,
	Row,
	Col,
	Typography,
} from '@smooth-ui/core-sc';
import { Form, Field } from 'react-final-form';
import { isTodayOrPrior } from '../../utils/dateUtil';
import InputWrapper from '../_library/InputWrapper';
import DatePicker from '../_library/DatePicker';
import Select from '../_library/Select';
import { Separator } from './styles';

const required = (value) => {
	const error = 'This field is required!';
	if (Array.isArray(value) && value.length === 0) return error;
	if (!value) return error;
	return undefined;
};
const mustBeTodayOrPrior = (value) => {
	if (!value) return required(value);
	return isTodayOrPrior(new Date(value)) ? undefined : 'The date must be prior or equal to today';
};

const getError = ({ error, touched }) => (touched && error ? error : undefined);
const isValid = ({ valid, touched }) => (!touched || valid);

const getMeta = (meta) => ({
	valid: isValid(meta),
	error: getError(meta),
});

// eslint-disable-next-line react/prop-types
const adapt = (Component) => ({ input, meta, ...rest }) => (
	<Component {...input} {...rest} {...getMeta(meta)} />
);

const AdaptedInputWrapper = adapt(InputWrapper);

const CreateForm = ({
	onSubmit,
}) => (
	<Form
		onSubmit={onSubmit}
		render={({
			handleSubmit,
			form,
			submitting,
			pristine,
		}) => (
			<form onSubmit={handleSubmit}>
				<Grid>
					<Row>
						<Col>
							<Typography variant="h2">New document</Typography>
						</Col>
					</Row>
					<Row>
						<Separator />
					</Row>
					<Row>
						<Col>
							<Field
								name="documentTitle"
								label="Title"
								placeholder="Enter the document's title"
								multiline
								height={118}
								component={AdaptedInputWrapper}
								validate={required}
							/>
						</Col>
						<Col xs={4}>
							<Field
								name="documentOriginalId"
								label="Identifier"
								placeholder="Original identifier"
								description="The identifier is the filename originally present in the briefing book. For example “uir001001”."
								component={AdaptedInputWrapper}
								validate={required}
							/>
						</Col>
					</Row>
					<Row>
						<Separator />
					</Row>
					<Row>
						<Col>
							<Field
								name="documentSummary"
								label="Summary"
								placeholder="Resume in a sentence or two the contents of the document"
								multiline
								height={200}
								component={AdaptedInputWrapper}
								validate={required}
							/>
						</Col>
					</Row>
					<Row>
						<Separator />
					</Row>
					<Row>
						<Col>
							<Field
								name="documentKind"
								validate={required}
							>
								{({ input, meta }) => (
									<InputWrapper
										label="Kind"
										{...getMeta(meta)}
										placeholder="Select a kind"
										options={[
											{
												value: 'conference-materials',
												label: 'Conference Materials',
											},
											{
												value: 'executive-order',
												label: 'Executive Order',
											},
											{
												value: 'speech',
												label: 'Speech',
											},
											{
												value: 'report',
												label: 'Report',
											},
										]}
										{...input}
									>
										{(props) => <Select {...props} />}
									</InputWrapper>
								)}
							</Field>
						</Col>
						<Col>
							<Field
								name="documentClassification"
								validate={required}
							>
								{({ input, meta }) => (
									<InputWrapper
										label="Classification"
										{...getMeta(meta)}
										placeholder="Select a classification"
										options={[
											{
												value: 'no-classification',
												label: 'No classification',
											},
											{
												value: 'classification-unknown',
												label: 'Classification unknown',
											},
											{
												value: 'secret',
												label: 'Secret',
											},
											{
												value: 'top-secret',
												label: 'Top Secret',
											},
										]}
										{...input}
									>
										{(props) => <Select {...props} />}
									</InputWrapper>
								)}
							</Field>
						</Col>
					</Row>
					<Row>
						<Separator />
					</Row>
					<Row>
						<Col>
							<Field
								name="documentDate"
								validate={mustBeTodayOrPrior}
							>
								{({ meta, input }) => (
									<InputWrapper
										label="Creation date"
										placeholder="YYYY-MM-DD"
										todayOrPrior
										{...getMeta(meta)}
										{...input}
									>
										{(props) => <DatePicker {...props} />}
									</InputWrapper>
								)}
							</Field>
						</Col>
						<Col>
							<Field
								name="documentPublicationDate"
								validate={mustBeTodayOrPrior}
							>
								{({ meta, input }) => (
									<InputWrapper
										label="Publication date"
										placeholder="YYYY-MM-DD"
										todayOrPrior
										{...getMeta(meta)}
										{...input}
									>
										{(props) => <DatePicker {...props} />}
									</InputWrapper>
								)}
							</Field>
						</Col>
					</Row>
					<Row>
						<Separator />
					</Row>
					<Row>
						<Button
							type="submit"
							alignSelf="flex-end"
							disabled={submitting || pristine}
						>
							Submit document
						</Button>
					</Row>
				</Grid>
			</form>
		)}
	/>
);

CreateForm.defaultProps = {
	onSubmit: () => {},
};

CreateForm.propTypes = {
	onSubmit: PropTypes.func,
};

export default CreateForm;

