import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Button from '../_library/Button';

export const Container = styled.header`
	position: ${({ isStatic }) => (isStatic ? 'static' : 'fixed')};
	top: 7rem;
	left: 0;
	width: 100%;
	z-index: 2;
	background: rgba(255,255,255,.95);
	box-shadow: 0 .5rem 2rem .5rem rgba(255,255,255,.6);
	border-bottom: 1px solid ${({ theme }) => theme.gray100};
`;

export const TabsContainer = styled.nav`
	padding: .75rem 1rem;
	display: flex;
	justify-content: space-around;
	z-index: 1;
	height: 3.5rem;
`;

export const Tabs = styled.nav`
	list-style: none;
	padding-top: .125rem;
`;

export const Tab = styled(NavLink)`
	display: inline-block;
	font-size: .875rem;
	line-height: .875rem;
	padding: .5rem 1rem .4rem;
	text-decoration: none;
	color: ${({ theme }) => theme.gray900};
	border-radius: 2rem;
	margin-right: 0.5rem;

	&:last-child {
		margin-right: 0;
	}

	&.active {
		background: ${({ theme }) => theme.primaryLight};
		color: ${({ theme }) => theme.primaryDark};
		cursor: default;
	}

	&:not(.active):hover {
		text-decoration: underline;
	}

	&:focus {
		outline: none;
		background: ${({ theme }) => theme.primaryDark10};
	}
`;

const StyledButton = styled(Button)`
	position: absolute;
	top: .4rem;
	white-space: nowrap;
	border: none;
	background: none;
	cursor: pointer;
	padding: 0;
`;

export const BackButton = styled(StyledButton)`
	left: 1.25rem;
	color: ${({ theme }) => theme.gray600};
	line-height: 2.9rem;

	&:hover:not(.disabled) {
		background: none;
		color: ${({ theme }) => theme.gray900};

		& > span {
			color: ${({ theme }) => theme.primaryDark};
			background: ${({ theme }) => theme.primaryLight};
		}
	} 

	& > span {
		font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		font-size: 1.5rem;
		line-height: 1.5rem;
		color: ${({ theme }) => theme.gray500};
		text-align: center;
		padding: .5rem 0;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		float: left;
		margin-right: 0.5rem;
		transition: background 200ms ease-out, color 200ms ease-out;
	}
`;

export const EditButton = styled(StyledButton)`
	position: relative;
	border: 1px solid ${({ theme }) => theme.gray300};
	padding: .5rem 1rem .4rem;
	font-size: .875rem;
	display: inline-block;
	line-height: .875rem;
	border-radius: 2rem;
	top: 0;
`;
