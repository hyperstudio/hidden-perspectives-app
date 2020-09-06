import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { Alert } from '@smooth-ui/core-sc';
import Fieldset from '../_library/Fieldset';
import InputWrapper from '../_library/InputWrapper';
import {
	Container,
	FormWrapper,
	Button,
	AlertsContainer,
} from './styles';

const required = (value) => {
	const error = 'This field is required!';
	if (Array.isArray(value) && value.length === 0) return error;
	if (!value) return error;
	return undefined;
};

const isEmail = (email) => {
	// eslint-disable-next-line no-control-regex, no-useless-escape
	const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

	return expression.test(String(email).toLowerCase());
};

const validateEmail = (value) => {
	if (!isEmail(value)) return 'Invalid email address!';
	return undefined;
};

const requiredEmail = (value) => required(value) || validateEmail(value);

const getError = ({ error, touched }) => (touched && error ? error : undefined);
const isValid = ({ valid, touched }) => (!touched || valid);

const getMeta = (meta) => ({
	valid: isValid(meta),
	error: getError(meta),
});

const adapt = (Component) => {
	const AdaptedComponent = ({ input, meta, ...rest }) => (
		<Component {...input} {...rest} {...getMeta(meta)} />
	);

	AdaptedComponent.propTypes = {
		input: PropTypes.shape({}).isRequired,
		meta: PropTypes.shape({}).isRequired,
	};

	return AdaptedComponent;
};

const AdaptedInputWrapper = adapt(InputWrapper);

const Login = ({
	errors,
	login,
	namePlaceholder,
	emailPlaceholder,
	passwordPlaceholder,
	loginButtonText,
	signupButtonText,
	onSubmit,
	onLoginMethodChange,
	callToLoginText,
	callToSignupText,
	loginTitle,
	signupTitle,
}) => (
	<Container>
		<FormWrapper>
			<Form
				onSubmit={(evt) => onSubmit(evt)}
				render={({
					handleSubmit,
					form,
					submitting,
					pristine,
				}) => (
					<form onSubmit={handleSubmit}>
						<Fieldset title={login ? loginTitle : signupTitle}>
							{!login && (
								<>
									<Field
										name="name"
										label="Username"
										autoComplete="username"
										placeholder={namePlaceholder}
										component={AdaptedInputWrapper}
										validate={required}
									/>
									<br />
								</>
							)}
							<Field
								name="email"
								label="Email"
								autoComplete="email"
								placeholder={emailPlaceholder}
								component={AdaptedInputWrapper}
								validate={requiredEmail}
							/>
							<br />
							<Field
								name="password"
								label="Password"
								type="password"
								autoComplete="password"
								placeholder={passwordPlaceholder}
								component={AdaptedInputWrapper}
								validate={required}
							/>
						</Fieldset>
						<AlertsContainer>
							{errors.map(({ message }) => (
								<Alert key={message} variant="danger">{message}</Alert>
							))}
						</AlertsContainer>
						<Button primary type="submit" disabled={submitting || pristine}>
							{login ? loginButtonText : signupButtonText}
						</Button>
						<Button
							onClick={(evt) => {
								evt.preventDefault();
								evt.stopPropagation();
								onLoginMethodChange(!login);
							}}
						>
							{login ? callToSignupText : callToLoginText}
						</Button>
					</form>
				)}
			/>
		</FormWrapper>
	</Container>
);

Login.defaultProps = {
	errors: [],
};

Login.propTypes = {
	errors: PropTypes.arrayOf(PropTypes.shape({
		message: PropTypes.string.isRequired,
	})),
	login: PropTypes.bool.isRequired,
	namePlaceholder: PropTypes.string.isRequired,
	emailPlaceholder: PropTypes.string.isRequired,
	passwordPlaceholder: PropTypes.string.isRequired,
	loginButtonText: PropTypes.string.isRequired,
	signupButtonText: PropTypes.string.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onLoginMethodChange: PropTypes.func.isRequired,
	callToLoginText: PropTypes.string.isRequired,
	callToSignupText: PropTypes.string.isRequired,
	loginTitle: PropTypes.string.isRequired,
	signupTitle: PropTypes.string.isRequired,
};

export default Login;

