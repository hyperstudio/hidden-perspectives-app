import styled from 'styled-components';

export const Container = styled.div`
	height: calc(100vh - 7rem);
	margin-top: 7rem;
	width: 100%;
	display: flex;
	user-select: none;
`;

export const ScrollContainer = styled.div`
	padding-top: 3.5rem;
	height: calc(100vh - 7rem);
	overflow-y: auto;
	width: calc(100vw - 25rem);
`;

export const Content = styled.div`
	max-width: calc(100vw - 38rem);
	margin: 0 auto;
	padding: 3rem 0;
	position: relative;

	.react-pdf__Page__canvas {
		border-radius: 3px;
		border: 1px solid ${({ theme }) => theme.commonBorderColor};
		margin: 0 auto 2rem;
		display: block;
		transition: width 200ms ease-out, height 200ms ease-out;
		${({ isZoomed }) => (isZoomed ? `
			height: auto !important;
			width: 100% !important;
		` : `
			height: calc(100vh - 13rem) !important;
			width: auto !important;
		`)}
	}
`;

export const ZoomControl = styled.button`
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
	color: ${({ theme }) => theme.gray700};
	background: white;
	position: fixed; 
	top: 13.5rem;
	right: 2.5rem;
	border-radius: 50%;
	width: 2.5rem;
	height: 2.5rem;
	line-height: 2.5rem;
	text-align: center;
	cursor: pointer;
	outline: none;
	transition: border-color 100ms ease-out, color 100ms ease-out, background 100ms ease-out;
	font-size: 1.5rem;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: 300;
	padding: 0;

	&:hover {
		color: ${({ theme }) => theme.primaryDark};
		background: ${({ theme }) => theme.primaryLight};
		border-color: ${({ theme }) => theme.primaryLight};
	}

	&::before {
		content: "${({ isZoomed }) => (isZoomed ? '−' : '+')}";
	}
`;
