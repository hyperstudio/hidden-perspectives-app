import styled from 'styled-components';

export const Container = styled.form`
	display: flex;
	align-items: center;
	justify-content: space-around;
	height: 100%;
	width: 100%;
	z-index: 2;
	border: 1px solid ${({ theme }) => theme.commonBorderColor};
	border-top-color: transparent;
	border-bottom-color: transparent;
	transition: color 200ms ease-out,
		border 200ms ease-out,
		box-shadow 200ms ease-out,
		border-radius 200ms ease-out;
	&:focus-within {
		${({ theme }) => theme.controlFocus()('primary')}
		border-color: ${({ theme }) => theme.primary};
		border-radius: 1px;
		border-top-width: 1px;
		background: none;
	}
`;

export const Loup = styled.span`
	flex-grow: 1;
	width: 1.5rem;
	height: 1.5rem;
`;

export const Field = styled.input`
	flex-grow: 9;
	height: 100%;
	border: none;
	font-size: 1rem;
	line-height: 1rem;
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
		border: none;
		outline: 0;
		text-align: left;
	}
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
