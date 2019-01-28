import { compose, withState, lifecycle } from 'recompose';
import { isPartlyInViewport, getHoveredSummary } from '../../../utils/timelineUtil';
import Summary from './Summary';

const originalShouldUpdate = (props, nextProps) => (
	props.hovered !== nextProps.hovered
	|| props.pinned !== nextProps.pinned
);

const willScroll = (hoveredElement) => {
	const hoveredElementIsArray = Array.isArray(hoveredElement);
	return hoveredElement && hoveredElementIsArray;
};

const mightBeInViewPort = (ref, hoveredElement) => {
	const hoveredDiv = getHoveredSummary(hoveredElement);
	if (!hoveredDiv) return false;

	const { top: hoveredDivTop, bottom: hoveredDivBottom } = hoveredDiv.getBoundingClientRect();
	const windowHeight = window.innerHeight;
	const { top, bottom } = ref.getBoundingClientRect();
	const isInRangeAbove = (top > (hoveredDivTop - windowHeight));
	const isInRangeBelow = (bottom < (hoveredDivBottom + windowHeight));
	return isInRangeAbove || isInRangeBelow;
};

export default compose(
	withState('componentRef', 'setComponentRef'),
	lifecycle({
		shouldComponentUpdate(nextProps) {
			const { hoveredElement } = nextProps;
			const ref = nextProps.componentRef;
			const shouldUpdate = originalShouldUpdate(this.props, nextProps);

			if (!shouldUpdate) return false;
			const isVisible = isPartlyInViewport(ref);
			const willScrollIntoView = willScroll(hoveredElement);
			if (shouldUpdate && !willScrollIntoView) return isVisible;
			if (shouldUpdate && !isVisible && willScrollIntoView) {
				const mightAppearInView = mightBeInViewPort(ref, hoveredElement);
				const willBeInViewport = willScrollIntoView && mightAppearInView;
				return willBeInViewport;
			}
			return shouldUpdate;
		},
	}),
)(Summary);
