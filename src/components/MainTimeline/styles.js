import styled from 'styled-components';

export const Container = styled.div`
	padding: 0 18rem 0 6rem;
	width: 100vw;
	height: calc(100vh - 4.5rem);
	overflow-y: auto;
	position: relative;
`;

export const MinimapContainer = styled.div`
	width: 6rem;
	height: 100%;
	position: fixed;
	top: 4.5rem;
	left: 0;
	border-right: 1px solid ${({ theme }) => theme.commonBorderColor};
	z-index: 1;
`;

export const BubbleChartContainer = styled.div`
	align-items: center;
	border-left: 1px solid ${({ theme }) => theme.commonBorderColor};
	display: flex;
	height: 100%;
	justify-content: center;
	position: fixed;
	right: 0;
	top: 0;
	width: 18rem;
	z-index: 1;
`;

export const EventPill = styled.div`
	position: absolute;
	border-radius: 50%;
	background: ${({ theme }) => theme.gray900};
	box-shadow: 0 0 0 2px white;
`;

export const SingleEventPill = styled(EventPill)`
	width: 5px;
	height: 5px;
	top: calc(2rem + 1px);
	left: 50%;
	transform: translateX(-50%);
	z-index: 2;
`;

export const MultipleEventsPill = styled(EventPill)`width: 17px;
	height: 11px;
	width: 11px;
	top: 0;
	left: -9px;
	box-shadow: 0 0 0 1px white;
	font-size: 8px;
	font-weight: bold;
	box-sizing: border-box;
	text-align: center;
	line-height: 11px;
	color: white;
`;

export const MultipleDocumentsPill = styled(MultipleEventsPill)`
	border-radius: 0;
	height: .5rem;
	width: .5rem;
	top: calc(.5rem - 3px);
	left: -.25rem;
	border: 1px solid ${({ theme }) => theme.gray900};
	background: ${({ theme }) => theme.usBlue};
	box-shadow: -1px -1px 0 0 white, -2px -2px 0 0 ${({ theme }) => theme.gray900};
`;

export const SingleDocumentPill = styled(SingleEventPill)`
	border-radius: 0;
	height: .5rem;
	width: .5rem;
	top: 10px;
	left: -1.25rem;
	border: 1px solid ${({ theme }) => theme.gray900};
	background: ${({ theme }) => theme.usBlue};
`;

export const LegendContainer = styled.div`
	position: fixed;
	top: 4.5rem;
	left: 0;
	width: 100%;
	height: 2.25rem;
	padding: .5rem 19rem .5rem 7rem;
	z-index: 10;
`;
