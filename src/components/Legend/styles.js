import styled from 'styled-components';

export const LegendLabel = styled.span`
	background-image: url("${({ itemType }) => `/icons/${itemType}.svg`}");
	background-size: 18px;
	background-position: left -0.2rem;
	background-repeat: no-repeat;
	display: inline-block;
	color: ${({ theme }) => theme.colors.gray600};
	${({ position }) => (position !== 'center' && `float: ${position};`)}
	${({ position }) => (position === 'center' && 'margin: 0 auto;')}
	font-size: .875rem;
	padding-left: 1.5rem;
	user-select: none;
`;

export const MainTimelineContainer = styled.div`
	position: fixed;
	top: 7rem;
	left: 0;
	width: 100%;
	height: 2.25rem;
	padding: 0 0 0 6rem;
	z-index: 10;
	pointer-events: none;
`;

export const LegendContainer = styled.span`
	background-color: white;
	padding-top: 1rem;
	padding-bottom: 0.5rem;
	padding-left: ${({ position }) => (position === 'left' ? 0 : '0.5rem')};
	padding-right: ${({ position }) => (position === 'right' ? 0 : '0.5rem')};
	border-radius: 15px;
	display: inline-block;
	${({ position }) => (position !== 'center' && `float: ${position};`)}
	${({ position }) => (position === 'center' && 'margin: 1rem auto;')}
`;

export const TimelineLegends = styled.div`
	width: calc(100vw - 24rem);
	padding: 0 1.5rem;
	display: inline-block;
`;

export const ProtagonistLegendContainer = styled.div`
	width: 18rem;
	padding: 0 1rem;
	float: right;
	text-align: center;
`;
