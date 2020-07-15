import {
	compose,
	withProps,
	lifecycle,
	onlyUpdateForKeys,
} from '@hypnosphi/recompose';
import {
	flatten,
	sortWith,
	ascend,
	prop,
} from 'ramda';
import { withRouter } from 'react-router-dom';
import { formatGraphcoolDocument, formatGraphcoolEvent } from '../../utils/graphcoolUtil';
import { getHoveredSummary } from '../../utils/timelineUtil';
import SummarySection from './SummarySection';

const formatEvents = (events) => flatten(events).map(formatGraphcoolEvent);
const formatDocuments = (documents) => flatten(documents).map(formatGraphcoolDocument);

const scrollToCurrent = () => {
	const currentElement = document.querySelector('.summary-element.current');
	if (!currentElement) return;
	currentElement.scrollIntoView({ behavior: 'smooth' });
};

export default compose(
	withRouter,
	withProps(({ events, documents }) => ({
		items: sortWith(
			[ascend(prop('date')), ascend(prop('title'))],
			[...formatEvents(events), ...formatDocuments(documents)],
		),
	})),
	lifecycle({
		componentDidMount() {
			scrollToCurrent();
		},
		componentWillUpdate(nextProps) {
			const { hoveredElement } = nextProps;
			const hoveredElementIsArray = Array.isArray(hoveredElement);
			if (hoveredElement && hoveredElementIsArray) {
				const element = getHoveredSummary(nextProps.hoveredElement);
				if (!element) return;
				element.scrollIntoView({ behavior: 'smooth' });
			}
		},
		componentDidUpdate(prevProps) {
			if (!this.props.hoveredElement) {
				document.getElementById('summary-section').scroll();
			}
			if (this.props.id !== prevProps.id) {
				scrollToCurrent();
			}
		},
	}),
	onlyUpdateForKeys([
		'items',
		'hoveredElement',
		'filteredTags',
		'isLoading',
	]),
)(SummarySection);

