import styled from 'styled-components';
import OriginalDayPicker from 'react-day-picker';

export const Container = styled.div`
	position: relative;

	.DayPicker {
		box-shadow: 0 .25rem 2rem -1rem black; 
		background: white;
		border-radius: 3px;
		border-width: ${({ theme }) => theme.inputBorderWidth};
		border-color: ${({ theme }) => theme.inputBorderColor};
		border-style: solid;
		min-width: 100%;
		padding: .5rem 0 0;
		z-index: 5;
		margin-bottom: 3rem;
	}
`;

export const DayPicker = styled(OriginalDayPicker)`
	position: absolute;
	top: 100%;
	left: 50%;
	z-index: 3;
	transform: translateX(-50%);
`;

