import React from 'react';
import PropTypes from 'prop-types';
import {
	BubbleChartContainer,
	BubblesSvg,
	BubblesLoadingContainer,
} from './styles';
import BubbleChartTooltips from './BubbleChartTooltips';
import BubbleChartImages from './BubbleChartImages';
import Bubbles from './Bubbles';
import LoadingIndicator from '../LoadingIndicator';

const BubbleChart = (props) => (
	<BubbleChartContainer {...props}>
		<BubblesSvg
			{...props}
			viewBox={`0 0 ${props.diameter} ${props.diameter}`}
		>
			<BubbleChartImages {...props} />
			{props.bubbleLayoutItems.length && !props.isLoading && <Bubbles {...props} />}
		</BubblesSvg>
		<BubblesLoadingContainer {...props}><LoadingIndicator /></BubblesLoadingContainer>
		<BubbleChartTooltips {...props} />
	</BubbleChartContainer>
);

BubbleChart.propTypes = {
	isLoading: PropTypes.bool,
	diameter: PropTypes.number,
	setHoveredElement: PropTypes.func,
	activeElementId: PropTypes.string,
	bubbleLayoutItems: PropTypes.arrayOf(
		PropTypes.shape({
			Stakeholder: PropTypes.shape({
				id: PropTypes.string,
				stakeholderFullName: PropTypes.string,
			}),
		}),
	),
	images: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			size: PropTypes.number,
			x: PropTypes.number,
			y: PropTypes.number,
			url: PropTypes.string,
		}),
	),
	hoveredElement: PropTypes.oneOfType([
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			itemType: PropTypes.string.isRequired,
		}),
		PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string.isRequired,
				itemType: PropTypes.string.isRequired,
			}),
		),
	]),
};

BubbleChart.defaultProps = {
	isLoading: false,
	diameter: 100,
	bubbleLayoutItems: [],
	images: [],
	hoveredElement: null,
	activeElementId: '',
	setHoveredElement: () => {},
};

export default BubbleChart;
