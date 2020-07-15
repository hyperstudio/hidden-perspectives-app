import {
	compose,
	lifecycle,
	withState,
	withHandlers,
	shouldUpdate,
} from '@hypnosphi/recompose';
import { withRouter } from 'react-router-dom';
import Bubble from './Bubble';

export default compose(
	withRouter,
	withState('componentRef', 'setComponentRef', undefined),
	withState('textNodeWidth', 'setTextNodeWidth', undefined),
	withHandlers({
		setTextNodeWidth: ({ setTextNodeWidth, componentRef, textNodeWidth }) => () => {
			if (!componentRef || typeof textNodeWidth !== 'undefined') return;
			const newTextNodeWidth = Math.ceil(componentRef.getBBox().width);
			setTextNodeWidth(newTextNodeWidth);
		},
	}),
	lifecycle({
		componentDidUpdate() {
			this.props.setTextNodeWidth();
		},
	}),
	shouldUpdate((props, nextProps) => (
		props.data.id !== nextProps.data.id
		|| props.hovered !== nextProps.hovered
		|| props.textNodeWidth !== nextProps.textNodeWidth
		|| props.image !== nextProps.image
	)),
)(Bubble);
