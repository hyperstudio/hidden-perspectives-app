import { compose, withState, withHandlers } from '@hypnosphi/recompose';
import Alerts from './Alerts';

const StatefulAlerts = compose(
	withState('isOpened', 'setIsOpened', true),
	withHandlers({
		onClose: ({ setIsOpened }) => () => setIsOpened(false),
	}),
)(Alerts);

StatefulAlerts.propTypes = Alerts.propTypes;
StatefulAlerts.defaultProps = Alerts.defaultProps;

export default StatefulAlerts;
