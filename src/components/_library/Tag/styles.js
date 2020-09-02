import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const getColor = ({
	theme,
	isActive,
	hovered,
}) => {
	if (hovered) return theme.primaryDark;
	if (isActive) return 'white';
	return theme.gray800;
};

const getBackground = ({
	theme,
	isActive,
	hovered,
}) => {
	if (hovered) return theme.primaryLight;
	if (isActive) return theme.primary;
	return theme.gray200;
};

export const Container = styled.span`
	border-radius: 1rem;
	background: ${getBackground};
	color: ${getColor};
	text-decoration: none;
	padding: .6rem 1rem .4rem;
	margin: 0 .5rem .5rem 0;
	font-size: .875rem;
	line-height: 1rem;
	display: inline-block;
	transition: color 100ms ease-out, background 100ms ease-out;
	cursor: ${({ interactive }) => (interactive ? 'pointer' : 'default')};

	&:hover {
		${({ interactive, theme }) => (interactive ? `
		color: ${theme.primaryDark};
		background: ${theme.primaryLight};
		` : '')};
	}

	img {
		vertical-align: sub;
	}
`;

export const Link = styled(NavLink)`
	display: inline-block;
`;
