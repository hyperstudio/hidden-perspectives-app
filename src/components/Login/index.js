import {
	withProps,
	withState,
	compose,
	withHandlers,
} from 'recompose';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import Login from './Login';
import { logUserIn, logUserOut } from '../../utils/localStorageUtil';

const SIGNUP_MUTATION = gql`
mutation CreateUser($userName: String!, $authProviderData: AuthProviderSignupData!) {
  createUser(
    userName: $userName
    authProvider: $authProviderData
  ) {
    id
  }
}
`;

const LOGIN_MUTATION = gql`
mutation SigninUser($email: AUTH_PROVIDER_EMAIL!) {
  signinUser(
    email: $email
  ) {
    token
    user {
      id
	  role
    }
  }
}
`;

const getLoginCallback = (props) => ({
	data,
	errors,
}) => {
	if (errors) {
		logUserOut();
		props.setErrors(errors);
		return;
	}
	const { signinUser: { token, user: { id, role } } } = data;
	logUserIn(token, id, role);
	props.clearFields();
};

const getLoginVariables = ({ email, password }) => ({
	email: { email, password },
});

const getSignupVariables = ({ name: userName, email, password }) => (({
	userName,
	authProviderData: {
		email: { email, password },
	},
}));

const getLoginMutation = (values) => ({
	mutation: LOGIN_MUTATION,
	variables: getLoginVariables(values),
});

const getSignupMutation = (values) => ({
	mutation: SIGNUP_MUTATION,
	variables: getSignupVariables(values),
});

export default compose(
	withApollo,
	withState('login', 'onLoginMethodChange', true),
	withState('errors', 'setErrors', []),
	withProps(({ history }) => ({
		namePlaceholder: 'Enter your username',
		emailPlaceholder: 'Enter your email address',
		passwordPlaceholder: 'Enter your password',
		loginTitle: 'Login into US-Iran Relations',
		signupTitle: 'Sign up into US-Iran Relations',
		loginButtonText: 'Login',
		signupButtonText: 'Sign up',
		callToLoginText: 'Already have an account?',
		callToSignupText: 'Not yet an account?',
		clearFields() {
			history.push('/');
		},
	})),
	withHandlers({
		onSubmit(props) {
			return (values) => {
				props.client.mutate(props.login ? getLoginMutation(values) : getSignupMutation(values))
					.then((data) => {
						const loginCallback = getLoginCallback(props);
						if (Object.prototype.hasOwnProperty.call(data, 'createUser')) {
							return props.client.mutate(getLoginMutation(values))
								.then(loginCallback);
						}
						return loginCallback(data);
					})
					.catch((err) => props.setErrors(err.graphQLErrors));
			};
		},
	}),
)(Login);
