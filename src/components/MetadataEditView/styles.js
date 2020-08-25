import styled from 'styled-components';
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
	width: 100%;
`;
