import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { logUserOut, getUserId } from '../../utils/localStorageUtil';
import { LogButton, UserInfoContainer, UserAvatar } from './styles';

const UserInfo = ({ userName }) => (
	<UserInfoContainer>
		<UserAvatar>{userName[0].toUpperCase()}</UserAvatar>
		<LogButton to="/" onClick={logUserOut} as={Link}>
			Logout
		</LogButton>
	</UserInfoContainer>
);

UserInfo.propTypes = {
	userName: PropTypes.string.isRequired,
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

