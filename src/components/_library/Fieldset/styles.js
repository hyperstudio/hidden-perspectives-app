import styled from 'styled-components';

export const Container = styled.fieldset`
	border: none;
	margin: 0 0 4rem;
	padding: 0;

	&:last-of-type {
		margin-bottom: ${({ mode }) => ((mode === 'edit') ? '4rem' : '2rem')};
	}
`;

export const Legend = styled.legend`
	margin-bottom: 1rem;
	display: block;
`;

export const EditLegend = styled.legend`
	margin-bottom: 1rem;
	display: block;
	background-color: white;
	border: 1px solid #dee2e6;
	border-radius: 5px;
	padding: 0.75rem 1rem 0 1rem;
`;

export const EditContainer = styled.fieldset`
	background-color: whitesmoke;
	padding: 1rem 2rem 2rem 2rem;
	border: 1px solid #dee2e6;
	border-radius: 5px;
`;
