import {
	withProps,
	withState,
	compose,
	withHandlers,
} from '@hypnosphi/recompose';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import Login from './Login';
import { logUserIn, logUserOut } from '../../utils/localStorageUtil';

const SIGNUP_MUTATION = gql`
mutation CreateUser($userName: String!, $email: String!, $password: String!, $role: String!) {
  createUser(
    userName: $userName
    email: $email
    password: $password
		role: $role
  ) {
		token
		user{
			id
			role
		}
  }
}
`;

const LOGIN_MUTATION = gql`
mutation SigninUser($email: String!, $password: String!) {
  signinUser(
    email: $email,
		password: $password
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
	const { token, user: { id, role } } = data.signInUser ? data.signInUser : data.createUser;
	logUserIn(token, id, role);
	props.clearFields();
};

const getLoginVariables = ({ email, password }) => ({
	email, password,
});

const getSignupVariables = ({ name: userName, email, password }) => (({
	userName,
	email,
	password,
	role: 'Viewer',
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
		callToSignupText: 'Don\'t have an account?',
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
						if (props.login === false) {
							return props.client.mutate(getLoginMutation(values))
								.then(loginCallback(data));
						}
						return loginCallback(data);
					})
					.catch((err) => props.setErrors(err.graphQLErrors));
			};
		},
	}),
)(Login);
