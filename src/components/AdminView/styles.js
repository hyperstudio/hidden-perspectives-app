import styled from 'styled-components';
import Headline from '../_library/Headline';

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

export const Table = styled.table`
  display: table !important;
  overflow-y: hidden;
  overflow-x: initial;
  width: 100%;
  padding: 1rem;
  table-layout: auto;
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
`;


export const Thead = styled.thead`
  text-align: left;
	background-color: ${({ theme }) => (theme.commonBorderColor)};
`;

export const Th = styled.th`
  font-weight: 400;
  &:first-child {
    border-radius: 4 0 0;
  }
  &:last-child {
    border-radius: 0 4 0;
  }
  padding: 0.5rem;
`;

export const Tbody = styled.tbody`
	border-top: 1px solid ${({ theme }) => (theme.commonBorderColor)};
`;

export const Td = styled.td`
  line-height: 1.3em;
  font-weight: 200;
  padding: 0.5rem;
`;

export const Title = styled(Headline)`
	line-height: 1.3;
	font-weight: 500;
	margin-bottom: 2vmax;
`;
