import styled from 'styled-components';

export const Container = styled.div`
	height: calc(100vh - 4.5rem);
	margin-top: 4.5rem;
	width: 100%;
	display: flex;
`;

export const ScrollContainer = styled.div`
	padding-top: 3.5rem;
	height: calc(100vh - 4.5rem);
	overflow-y: auto;
	width: calc(100vw - 25rem);
`;

export const Content = styled.div`
	max-width: 50rem;
	margin: 0 auto;
	padding: 2rem 0 3rem 0;
	position: relative;
`;
