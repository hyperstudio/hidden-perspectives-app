import React from 'react';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import { compose, withHandlers, withState } from '@hypnosphi/recompose';
import TextInput from '../TextInput';
import { isTodayOrPrior, isTodayOrAfter, getFormattedDate } from '../../../utils/dateUtil';
import {
	DayPicker,
	Container,
} from './styles';


const DatePicker = ({
	isFocused,
	setIsFocused,
	value,
	onDaySelect,
	onChange,
	todayOrPrior,
	todayOrAfter,
	...rest
}) => (
	<OutsideClickHandler onOutsideClick={() => setIsFocused(false)}>
		<Container>
			<TextInput
				{...rest}
				onFocus={() => setIsFocused(true)}
				value={value}
				onChange={(evt) => onChange(evt.target.value)}
			/>
			{isFocused && (
				<DayPicker
					onDayClick={onDaySelect}
					selectedDays={new Date(value)}
					onBlur={() => setIsFocused(false)}
					disabledDays={(day) => {
						if (todayOrPrior) return !isTodayOrPrior(day);
						if (todayOrAfter) return !isTodayOrAfter(day);
						return undefined;
					}}
				/>
			)}
		</Container>
	</OutsideClickHandler>
);

DatePicker.propTypes = {
	isFocused: PropTypes.bool,
	setIsFocused: PropTypes.func,
	value: PropTypes.string,
	onChange: PropTypes.func,
	onDaySelect: PropTypes.func,
	todayOrPrior: PropTypes.bool,
	todayOrAfter: PropTypes.bool,
};

DatePicker.defaultProps = {
	isFocused: false,
	setIsFocused: () => {},
	onDaySelect: () => {},
	onChange: () => {},
	value: undefined,
	todayOrPrior: false,
	todayOrAfter: false,
};

export default compose(
	withState('isFocused', 'setIsFocused', false),
	withHandlers({
		onDaySelect: ({ setIsFocused, onChange }) => (dayDate) => {
			const formattedDate = getFormattedDate(dayDate);
			onChange(formattedDate);
			setIsFocused(false);
		},
	}),
)(DatePicker);

