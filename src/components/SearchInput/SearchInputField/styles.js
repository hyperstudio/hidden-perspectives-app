import styled from 'styled-components';

export const Container = styled.form`
	position: relative;
	height: 100%;
	width: 100%;
	z-index: 2;
	background: white;
`;

export const Field = styled.input`
	position: relative;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
	border-left-color: transparent;
	border-top-color: transparent;
	border-bottom-color: transparent;
	background: ${({ value }) => (value ? 'none' : 'url("/icons/loup.svg")')};
	background-position: 3.5rem center;
	background-size: 1.5rem 1.5rem;
	background-repeat: no-repeat;
	font-size: 1rem;
	line-height: 1rem;
	padding: 2.25rem 2rem 2rem 2rem;
	border-radius: 0;
	transition: color 200ms ease-out,
		border 200ms ease-out,
		box-shadow 200ms ease-out,
		border-radius 200ms ease-out;
	text-align: ${({ value }) => (value ? 'left' : 'center')};

	&::placeholder {
		color: ${({ theme }) => theme.gray500};
	}

	&:focus {
		${({ theme }) => theme.controlFocus()('primary')}
		border-color: ${({ theme }) => theme.primary};
		border-radius: 1px;
		border-top-width: 1px;
		text-align: left;
		background: none;
	}
`;

export const FieldChildren = styled.div`
`;

export const ClearButton = styled.span`
	position: absolute;
	top: 50%;
	right: 2rem;
	transform: translateY(-50%);
	color: ${({ theme }) => theme.gray500};
	cursor: pointer;
	transition: color 200ms ease-out;
	padding-top: .25rem;

	&:hover {
		color: ${({ theme }) => theme.gray800};
	}
`;
