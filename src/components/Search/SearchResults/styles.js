import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
	width: 100vw;
	height: calc(100vh - 7rem);
	position: fixed;
	top: 7rem;
	left: 0;
	background: ${({ theme }) => theme.gray200};
	transition: opacity 200ms ease-out;
	opacity: ${({ show }) => (show ? 1 : 0)};
	text-align: left;
	${({ show }) => (!show && 'pointer-events: none;')}
`;

export const Content = styled.div`
	width: 38rem;
	margin: 0 auto;
`;

export const Results = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	max-height: calc(100vh - 10.5rem);
	overflow-y: auto;
`;

export const Result = styled.li`
	position: relative;
	padding: .875rem 1rem .625rem 2rem;
	margin-bottom: 0.25rem;
	background: white;
	border-radius: .25rem;
	font-size: .875rem;
	line-height: 1rem;
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
	cursor: pointer;
	background-image: url("${({ type }) => `/icons/${type}.svg`}");
	background-size: 1rem 1rem;
	background-position: .5rem center;
	background-repeat: no-repeat;
	box-shadow: 0 0 0 rgba(0, 0, 0, 0),
		inset 0 0 0 0 ${({ theme }) => theme.primaryLight};
	transition: border 200ms ease-out,
		box-shadow 200ms ease-out;

	&.highlighted {
		border-color: ${({ theme }) => theme.primary};
		box-shadow: 0 6px 20px -6px rgba(0, 0, 0, 0.2),
			inset 0 0 0 1px ${({ theme }) => theme.primary};
	}
`;

export const ResultInfo = styled(Result)`
  background: ${({ theme }) => theme.gray300};
	cursor: default;
`;

const pulse = keyframes`
	0% {
		opacity: 1;
	}
	50% {
		opacity: .3;
	}
	100% {
		opacity: 1;
	}
`;

export const LoadingResult = styled(Result)`
	background-image: none;
	animation: ${pulse} 1.2s infinite;
	animation-timing-function: ease-in-out;

	&:nth-child(2) {
		animation-delay: 200ms;
	}

	&:nth-child(3) {
		animation-delay: 400ms;
	}
`;

export const TabsContainer = styled.div`
	padding: 1.5rem 0 1rem 0;
	position: relative;
`;

export const Tabs = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	font-size: .875rem;
	line-height: .875rem;
	color: ${({ theme }) => theme.gray600};
`;

export const Tab = styled.li`
	display: inline-block;
	margin-right: 1rem;
	transition: color 200ms ease-out;
	cursor: default;

	&.active,
	&:hover {
		color: black;
	}

	&:not(.active):hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

export const TabHint = styled.span`
	padding: .4rem .625rem;
	border-radius: 1rem;
	background: ${({ theme }) => theme.gray300};
	color: ${({ theme }) => theme.gray600};
	font-size: .75rem;
	line-height: .625rem;
	position: absolute;
	top: 1rem;
	right: 0;
`;

export const Key = styled.span`
	padding: 4px 3px 0;
	background: white;
	color: black;
	border-radius: 2px;
	margin: 0 0.25rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, .12),
		0 2px 2px rgba(0, 0, 0, .08),
		0 0 2px rgba(0, 0, 0, .06);
	display: inline-block;
`;

export const Highlight = styled.span`
	background: ${({ theme }) => theme.primaryLight};
	color: ${({ theme }) => theme.primaryDark};
	padding: 0 0.25rem;
	border-radius: 2px;
`;

export const NoResults = styled.div`
	text-align: center;
	font-size: 1.5rem;
	line-height: 2rem;
	color: ${({ theme }) => theme.gray600};
	padding: 3rem 0;
`;
