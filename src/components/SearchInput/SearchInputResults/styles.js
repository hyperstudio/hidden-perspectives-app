import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
	z-index: 3;
	position: absolute;
	background: ${({ theme }) => theme.gray200};
	transition: opacity 200ms ease-out;
	opacity: ${({ show }) => (show ? 1 : 0)};
	text-align: left;
	${({ show }) => (!show && 'pointer-events: none;')}
`;

export const Content = styled.div`
	
`;

export const Results = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	max-height: calc(15rem);
	overflow-y: auto;
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
`;

export const Result = styled.li`
	position: relative;
	padding: .875rem 1rem .625rem 2rem;
	background: white;
	border-radius: .25rem;
	font-size: .875rem;
	line-height: 1rem;
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
	font-size: 1rem;
	color: ${({ theme }) => theme.gray600};
	padding: 1rem;
`;
