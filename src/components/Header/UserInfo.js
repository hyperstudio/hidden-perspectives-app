import React from 'react';
import { withState, lifecycle, compose } from '@hypnosphi/recompose';
import {
	usePopoverState,
	Popover,
	PopoverDisclosure,
} from 'reakit/Popover';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import Errors from '../Errors';
import { withLoading } from '../../utils/hocUtil';
import { logUserOut, getUserId, isAuthorized } from '../../utils/localStorageUtil';
import {
	LogButton,
	MenuButton,
	MenuLink,
	MenuLinkWrapper,
	PopoverMenu,
	StyledPopoverArrow,
	UserAvatar,
	UserInfoContainer,
} from './styles';

const PopoverLink = ({ disclosure, ...props }) => {
	const popover = usePopoverState({ placement: 'bottom' });
	return (
		<>
			<PopoverDisclosure {...popover} ref={disclosure.ref} {...disclosure.props}>
				{(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
			</PopoverDisclosure>
			<Popover hideOnClickOutside {...popover} {...props}>
				<StyledPopoverArrow {...popover} />
				<PopoverMenu>
					<MenuLinkWrapper>
						<MenuLink to="/document/new" as={Link} onClick={popover.hide}>Document</MenuLink>
					</MenuLinkWrapper>
					<MenuLinkWrapper>
						<MenuLink to="/event/new" as={Link} onClick={popover.hide}>Event</MenuLink>
					</MenuLinkWrapper>
					<MenuLinkWrapper>
						<MenuLink to="/protagonist/new" as={Link} onClick={popover.hide}>Stakeholder</MenuLink>
					</MenuLinkWrapper>
				</PopoverMenu>
			</Popover>
		</>
	);
};

PopoverLink.propTypes = {
	disclosure: PropTypes.shape().isRequired,
};

const UserInfo = ({
	adminText,
	userName,
	isLoading,
	errors,
}) => !isLoading && (
	<UserInfoContainer>
		<Errors errors={errors} />
		{isAuthorized(['Editor', 'Admin']) && (
			<>
				<PopoverLink
					disclosure={(
						<MenuButton>
							New
							<img src="/icons/caret-down-fill.svg" alt="caret-down-fill" />
						</MenuButton>
					)}
				/>
			</>
		)}
		<UserAvatar>{userName}</UserAvatar>
		{isAuthorized(['Admin']) && (
			<LogButton to="/admin" as={Link}>{adminText}</LogButton>
		)}
		<LogButton to="/" onClick={logUserOut} as={Link}>
			Logout
		</LogButton>
	</UserInfoContainer>
);

UserInfo.propTypes = {
	isLoading: PropTypes.bool,
	userName: PropTypes.string,
	adminText: PropTypes.string,
	errors: PropTypes.arrayOf(PropTypes.string),
};

UserInfo.defaultProps = {
	adminText: 'Admin',
	isLoading: true,
	userName: '',
	errors: [],
};

const USERNAME_QUERY = gql`
query getUser($id: String) {
  user(where: { id: $id }) {
    userName
  }
}
`;

const getDataHandler = ({
	stopLoading,
	setUserName,
}) => ({ data }) => {
	stopLoading();
	setUserName(data.user.userName[0].toUpperCase());
};

export default compose(
	withApollo,
	withLoading,
	withState('userName', 'setUserName', ''),
	withState('errors', 'setErrors', []),
	lifecycle({
		componentDidMount() {
			const { client } = this.props;
			client.query({
				query: USERNAME_QUERY,
				variables: { id: getUserId() },
			})
				.then((data) => getDataHandler(this.props)(data))
				.catch((err) => {
					this.props.stopLoading();
					this.props.setErrors([err.message]);
				});
		},
	}),
)(UserInfo);
