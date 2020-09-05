import styled from 'styled-components';
import { lighten } from 'polished';
import Headline from '../_library/Headline';

export const Container = styled.div`
	width: 28rem;
	position: fixed;
	bottom: 2rem;
	left: 50%;
	transform: translateX(-50%);
	color: black;
	background: ${({ theme, variant }) => {
		switch (variant) {
		case 'danger': return lighten(0.53, theme.danger);
		case 'success': return 'rgb(212, 237, 217)';
		case 'warning': return 'rgb(255, 242, 205)';
		default: return theme.gray100;
		}
	}};
	border: 1px solid ${({ theme, variant }) => {
		switch (variant) {
		case 'danger': return theme.danger;
		case 'success': return 'rgb(194, 230, 202)';
		case 'warning': return 'rgb(255, 237, 185)';
		default: return theme.gray200;
		}
	}};
	padding: 1rem;
	z-index: 2;
	border-radius: .25rem;
	font-size: 1rem;
	line-height: 1.4rem;
	box-shadow: 0 .5rem 1rem -.25rem rgba(0,0,0,.1);
	text-align: left;
`;

export const CloseButton = styled.span`
	position: absolute;
	top: 1rem;
	right: 1rem;
	cursor: pointer;
	opacity: 1;
	transition: opacity 200ms ease-out;

	&:hover {
		opacity: .6;
	}
`;

export const Title = styled(Headline)`

`;

export const AlertEl = styled.div`
	& > p {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}
`;
