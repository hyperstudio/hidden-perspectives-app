import React from 'react';
import PropTypes from 'prop-types';
import {
	Container,
	CloseButton,
	AlertEl,
} from './styles';

const Alerts = ({ alerts, isOpened, onClose }) => (alerts.length > 0 && isOpened ? (
	<Container variant={alerts[0] ? alerts[0].variant : ''}>
		<CloseButton onClick={onClose}>✕</CloseButton>
		{alerts.map((alert) => (
			<AlertEl key={alert.message} variant={alert.variant}>
				{alert.message.split('\n').map((alertLine) => (
					<p key={alertLine}>{alertLine}</p>
				))}
			</AlertEl>
		))}
	</Container>
) : null);

Alerts.propTypes = {
	alerts: PropTypes.arrayOf(
		PropTypes.shape({
			message: PropTypes.string.isRequired,
			variant: PropTypes.string.isRequired,
		}),
	),
	isOpened: PropTypes.bool,
	onClose: PropTypes.func,
};

Alerts.defaultProps = {
	alerts: [],
	isOpened: true,
	onClose: () => {},
};

export default Alerts;
