import styled from 'styled-components';

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
