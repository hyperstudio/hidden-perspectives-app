import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const HeaderContainer = styled.header`
	width: 100%;
	height: 4.5rem;
	position: fixed;
	top: 0;
	left: 0;
	background: white;
	text-align: right;
	z-index: 3;
	border-bottom: 1px solid ${({ theme }) => theme.commonBorderColor};
	display: flex;
	justify-content: space-between;
`;

const HeaderLink = styled(NavLink)`
	border: none;
	background: none;
	color: ${({ theme }) => theme.gray600};
	font-family: inherit;
	font-size: 1rem;
	line-height: 1rem;
	padding: 0.8rem 1rem 0.7rem;
	margin: 1rem;
	cursor: pointer;
	outline: none;
	text-decoration: none;
	display: inline-block;
	border-radius: 3px;

	&.active,
	&:hover,
	&:focus {
		color: ${({ theme }) => theme.black};
	}

	&.active {
		cursor: default;
	}

	&:not(.active):hover {
		text-decoration: underline;
	}

	&:focus {
		box-shadow: inset 0 0 0 2px ${({ theme }) => theme.gray700};
	}
`;

export const Logo = styled(HeaderLink)`
	position: absolute;
	top: -10px;
	left: 0;
	z-index: 1;
`;

export const LogoH2 = styled(HeaderLink)`
	position:absolute;
	top: 10px;
	left: 0;
	text-align: justify;
	font-size:12px;
`;

export const LogButton = styled(HeaderLink)`
	margin-left: 16px;
`;

export const UserInfoContainer = styled.div`
	font-size: 12px;
	position: absolute;
	top: 0;
	right: 0;
	z-index: 1;
`;

export const UserAvatar = styled.span`
	display: inline-block;
	width: 1.5rem;
	height: 1.5rem;
	box-shadow: 0 0 0 2px ${({ theme }) => theme.gray300};
	font-size: 1rem;
	line-height: 1rem;
	text-align: center;
	border-radius: 50%;
	padding-top: .45rem;
`;
