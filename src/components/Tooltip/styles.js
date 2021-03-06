import styled from 'styled-components';
import Headline from '../_library/Headline';

export const Container = styled.div`
	position: absolute;
	${({ position }) => position}: 0;
	opacity: 0;
	pointer-events: none;
	width: 100%;
	min-width: 20rem;
	max-width: 30rem;
	height: auto;
	padding: 1rem 0 0;
	z-index: 4;
`;

export const Content = styled.div`
	padding: 1rem;
	border-radius: .25rem;
	background: white;
	z-index: 10;
	text-align: left;
	box-shadow: 0 .5rem 1rem rgba(0,0,0,.1);
	white-space: normal;

	&::after {
		content: '';
		clear: both;
		display: table;
	}
`;

export const Trigger = styled.div`
	position: relative;
	cursor: pointer;
	display: inline-block;

	&:hover ${Container} {
		opacity: 1;
		pointer-events: all;
	}
`;

export const Title = styled(Headline)`
	color: ${({ theme }) => theme.gray900};
	font-size: 1rem;
	line-height: 1.4rem;
	margin: 0 0 .5rem 0;
`;

export const Subtitle = styled(Headline)`
	color: ${({ theme }) => theme.gray600};
	font-size: .875rem;
	line-height: 1rem;
	margin: 0 0 .5rem 0;
`;

export const Summary = styled.p`
	margin: 0;
	font-size: .875rem;
	line-height: 1.125rem;
	font-weight: normal;
	color: ${({ theme }) => theme.gray900};
`;

export const AuthorsContainer = styled.div`
	margin-top: 1rem;
	float: left;
	width: 100%;
`;
