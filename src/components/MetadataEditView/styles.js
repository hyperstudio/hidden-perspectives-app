import styled from 'styled-components';
import { ControlFeedback } from '@smooth-ui/core-sc';
import 'react-day-picker/lib/style.css';

export const Container = styled.div`
	height: calc(100vh - 7rem);
	margin-top: 7rem;
	width: 100%;
	display: flex;
`;

export const ScrollContainer = styled.div`
	padding-top: 1rem;
	height: calc(100vh - 7rem);
	overflow-y: auto;
	width: calc(100vw);
`;

export const Content = styled.div`
	max-width: 50rem;
	margin: 0 auto;
	padding: 2rem 0 3rem 0;
	position: relative;
`;

export const AlertsContainer = styled.div`
	margin-bottom: 2rem;

	& > div {
		padding: 1rem 1.25rem .75rem;
	}
`;

export const RemoveButton = styled.span`
	display: inline-block;
	cursor: pointer;
	margin-left: 0.5rem;
	vertical-align: middle;

	transition: color 250ms ease-in;
	&:hover {
		color: red;
		transition: color 0ms ease-in;
	}
`;

export const TagsEditWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding-top: 1rem;
	padding-left: 1rem;
	padding-bottom: 1rem;
	width: 100%;
`;

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

export const TagLikeContainer = styled.span`
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
`;

export const TagsInput = styled.input`
	border-radius: 1rem;
	border: none;
	text-decoration: none;
	padding: .6rem 1rem .4rem;
	margin: 0 .5rem .5rem 0;
	font-size: .875rem;
	line-height: 1rem;
	display: inline-block;
	&:focus {
		${({ theme }) => (theme.controlFocus()('primary'))}
		z-index: 1;
	}
`;

export const ControlFeedbackBlack = styled(ControlFeedback)`
	color: black;
`;

export const ButtonsContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;
