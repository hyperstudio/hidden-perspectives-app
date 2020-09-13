import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { PopoverArrow } from 'reakit/Popover';

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
	justify-content: space-around;
	align-items: center;
`;

const HeaderLink = styled(NavLink)`
	border: none;
	background: none;
	color: ${({ theme }) => theme.gray600};
	font-family: inherit;
	font-size: 1rem;
	cursor: pointer;
	outline: none;
	text-decoration: none;
	text-align: left;

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

export const LogoContainer = styled.div`
	z-index: 1;
	display: flex;
	flex-direction: column;
	padding-left: 1rem;
	padding-right: 1rem;
	flex-basis: 33%;
	flex-shrink: 2;
`;

export const Logo = styled(HeaderLink)`
	z-index: 1;
`;

export const LogoH2 = styled(HeaderLink)`
	text-align: left;
	font-size:12px;
`;

export const LogButton = styled(HeaderLink)`
	margin-left: 16px;
`;

export const MenuButton = styled.button`
	border: none;
	background: none;
	color: ${({ theme }) => theme.gray600};
	font-family: inherit;
	font-size: 1rem;
	cursor: pointer;
	outline: none;
	text-decoration: none;
	text-align: left;
	padding: 0;
	
	img {
		padding-left: 5px;
	}

	&.active,
	&:hover,
	&:focus {
		color: ${({ theme }) => theme.black};
	}

	&.active {
		cursor: default;
	}

	&:not(.active):hover {
		text-decoration: none;
	}

	&:focus {
		box-shadow: inset 0 0 0 2px ${({ theme }) => theme.gray700};
	}
`;

export const PopoverMenu = styled.div`
	background-color: white;
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
	line-height: 1.5rem;
	padding: 0.5rem 0 0.5rem 0;
	text-align: left;
	border-radius: 5%;
`;

export const MenuLink = styled(HeaderLink)`
	&:focus {
		box-shadow: none;
		border: none;
	}
`;

export const MenuLinkWrapper = styled.div`
	width: 100%;
	padding-left: 1rem;
	padding-right: 1rem;
	padding-top: 0.3rem;

	&:hover {
		background-color: ${({ theme }) => theme.gray300};
	}
`;

export const StyledPopoverArrow = styled(PopoverArrow)`
	svg {
		fill: white;
			transform: translateY(1.5px) !important;
		path.stroke{
			stroke: ${({ theme }) => theme.commonBorderColor};
			stroke-width: 1;
		}
		path.fill {
			stroke :none;
		}
	}
`;

export const UserInfoContainer = styled.div`
	font-size: 12px;
	flex-basis: 33%;
	padding-left: 1rem;
	padding-right: 1rem;
	flex-shrink: 1;
`;

export const UserAvatar = styled.span`
	display: inline-block;
	margin-left: 16px;
	width: 1.5rem;
	height: 1.5rem;
	box-shadow: 0 0 0 2px ${({ theme }) => theme.gray300};
	font-size: 1rem;
	line-height: 1rem;
	text-align: center;
	border-radius: 50%;
	padding-top: .45rem;
`;
