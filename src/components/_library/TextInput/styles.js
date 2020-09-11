import styled from 'styled-components';
import { Input as SmoothUiInput } from '@smooth-ui/core-sc';

export const Input = styled(SmoothUiInput)`
	width: 100%;
	border: ${({ theme, valid }) => (!valid ? `1px solid ${theme.red};` : 'none')};
	border-radius: 0;
	padding: 1rem 1rem .75rem;
	position: relative;
	height: 100%;
	${({ monospace }) => ((monospace === 'true') ? ('font-family: monospace; font-size: 16px;') : '')}

	&:focus {
		${({ theme, valid }) => (!valid ? theme.controlFocus()('red') : theme.controlFocus()('primary'))}
		border-radius: 1px;
		z-index: 1;
	}
`;

export const TextArea = styled.textarea`
	width: 100%;
	height: 100%;
	min-height: 10rem;
	max-width: 100%;
	min-width: 100%;
	float: left;
`;
