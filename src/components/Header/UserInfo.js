import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { logUserOut, getUserId, isAuthorized } from '../../utils/localStorageUtil';
import {
	LogButton, UserInfoContainer, UserAvatar,
} from './styles';

const UserInfo = ({ userName, adminText }) => (
	<UserInfoContainer>
		<UserAvatar>{userName[0].toUpperCase()}</UserAvatar>
		{isAuthorized(['Admin']) && (
			<LogButton to="/admin" as={Link}>{adminText}</LogButton>
		)}
		<LogButton to="/" onClick={logUserOut} as={Link}>
			Logout
		</LogButton>
	</UserInfoContainer>
);

UserInfo.propTypes = {
	userName: PropTypes.string.isRequired,
	adminText: PropTypes.string,
};

UserInfo.defaultProps = {
	adminText: 'Admin',
};

const USERNAME_QUERY = gql`
query getUser($id: String) {
  user(where: { id: $id }) {
    userName
  }
}
`;

export default () => (
	<Query query={USERNAME_QUERY} variables={{ id: getUserId() }}>
		{({ loading, error, data }) => {
			if (error) {
				return null;
			}
			if (loading) {
				return null;
			}
			return <UserInfo userName={data.user.userName} />;
		}}
	</Query>
);

