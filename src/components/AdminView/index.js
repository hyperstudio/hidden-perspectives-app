import { withRouter } from 'react-router-dom';
import {
	compose,
	lifecycle,
	withState,
	withHandlers,
} from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withLoading, withAlerts } from '../../utils/hocUtil';
import AdminView from './AdminView';

const getUsersQuery = () => (gql`
	query GetUsers {
		users(orderBy: { email: asc }){
			id
			email
			userName
			role
		}
	}
`);

const getUpdateUserMutation = () => (gql`
	mutation UpdateUser($id: String, $data: UserUpdateInput!) {
		updateOneUser(where: { id: $id }, data: $data){
			role
		}
	}
`);

const getDeleteUserMutation = () => (gql`
	mutation DeleteUser($id: String){
		deleteOneUser(where: { id: $id }){
			id
		}
	}
`);

const getDeletionCallback = (props) => ({
	errors,
}) => {
	if (errors) {
		props.setErrors(errors);
		return;
	}
	props.setAlerts([{ message: 'User deleted successfully.', variant: 'warning' }]);
};

const getMutationCallback = (props) => ({
	errors,
}) => {
	if (errors) {
		props.setErrors(errors);
		return;
	}
	props.setAlerts([{ message: 'User\'s role changed successfully.', variant: 'success' }]);
};

const getDataHandler = ({
	stopLoading,
	setUsers,
	setSelectState,
	onToggle,
	setAlerts,
	history,
}) => ({ data }) => {
	stopLoading();
	setUsers(data.users);
	const selectState = {};
	const toggleState = {};
	const usersMapped = data.users.map((user) => {
		const { id, role } = user;
		return { key: id, value: role };
	});
	for (let i = 0; i < usersMapped.length; i += 1) {
		selectState[usersMapped[i].key] = { label: usersMapped[i].value, value: usersMapped[i].value };
		toggleState[usersMapped[i].key] = false;
	}
	setSelectState(selectState);
	onToggle(toggleState);

	if (history.location.state && history.location.state.alerts) {
		setAlerts(history.location.state.alerts);
	}
};

export default compose(
	withApollo,
	withRouter,
	withLoading,
	withAlerts,
	withState('deleted', 'setDeleted', []),
	withState('errors', 'setErrors', []),
	withState('users', 'setUsers', []),
	withState('selectState', 'setSelectState', {}),
	withState('toggled', 'onToggle', {}),
	withHandlers({
		refreshUsers: (props) => () => {
			props.startLoading();
			props.client.query({
				query: getUsersQuery(),
				fetchPolicy: 'network-only',
			})
				.then((data) => {
					getDataHandler(props)(data);
				})
				.catch((err) => {
					props.stopLoading();
					props.setErrors([err.message]);
				});
		},
		handleSelectChange: (props) => (id, role) => {
			props.startLoading();
			props.client.mutate({
				mutation: getUpdateUserMutation(),
				variables: {
					id,
					data: { role: { set: role } },
				},
			})
				.then((data) => {
					getDataHandler(props);
					const mutationCallback = getMutationCallback(props);
					props.stopLoading();
					return mutationCallback(data);
				})
				.catch((err) => {
					props.stopLoading();
					props.setErrors([err.message]);
				});
		},
		handleDelete: (props) => (id) => {
			props.startLoading();
			props.client.mutate({
				mutation: getDeleteUserMutation(),
				variables: {
					id,
				},
			}).then((data) => {
				props.setDeleted([...props.deleted, id]);
				props.onToggle({ ...props.toggled, [id]: false });
				const deletionCallabck = getDeletionCallback(props);
				props.stopLoading();
				return deletionCallabck(data);
			}).catch((err) => {
				props.stopLoading();
				props.setErrors([err.message]);
			});
		},
	}),
	lifecycle({
		componentDidMount() {
			const { client } = this.props;
			client.query({
				query: getUsersQuery(),
			})
				.then(getDataHandler(this.props))
				.catch((err) => {
					this.props.stopLoading();
					this.props.setErrors([err.message]);
				});
		},
	}),
)(AdminView);
