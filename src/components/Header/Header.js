import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import UserInfo from './UserInfo';
import Search from '../Search';
import {
	HeaderContainer,
	LogoContainer,
	UserInfoContainer,
	LogButton,
	Logo,
	LogoH2,
} from './styles';

// REMOVE THE PRODUCTION CHECK WHEN YOU PLAN TO INTRODUCE SIGN UP
const isProduction = process && process.env && process.env.NODE_ENV === 'production';

const Header = ({
	isAuthenticated,
	browserIsNotSupported,
}) => (browserIsNotSupported ? (
	<Redirect to="/unsupported-browser" />
) : (
	<HeaderContainer>
		<LogoContainer>
			<Logo to="/">US-Iran Relations</Logo>
			<LogoH2 to="/">National Narratives, America, Iran, and the Clash of Civilizations</LogoH2>
		</LogoContainer>
		<Search />
		{!isProduction && (
			!isAuthenticated() ? (
				<UserInfoContainer>
					<LogButton to="/login" exact>
						Login
					</LogButton>
				</UserInfoContainer>
			) : <UserInfo />
		)}
	</HeaderContainer>
));

Header.propTypes = {
	isAuthenticated: PropTypes.func,
	browserIsNotSupported: PropTypes.bool,
};

Header.defaultProps = {
	isAuthenticated: () => false,
	browserIsNotSupported: true,
};

export default Header;
