import { compose, withState, withHandlers } from '@hypnosphi/recompose';
import Errors from './Errors';

const StatefulErrors = compose(
	withState('isOpened', 'setIsOpened', true),
	withHandlers({
		onClose: ({ setIsOpened }) => () => setIsOpened(false),
	}),
)(Errors);

StatefulErrors.propTypes = Errors.propTypes;
StatefulErrors.defaultProps = Errors.defaultProps;

export default StatefulErrors;
