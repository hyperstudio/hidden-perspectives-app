import {
	compose,
	withProps,
	lifecycle,
	withState,
	withHandlers,
} from '@hypnosphi/recompose';
import { prop } from 'ramda';
import BubbleChart from './BubbleChart';
import { calcBubbleLayout, calcForceLayout } from './calculateChartLayout';
import { getWikipediaImage } from '../../utils/imageUtil';

const formatItems = (bubblesData, activeId) => {
	const formattedData = Object.keys(bubblesData).map((key) => ({
		...bubblesData[key],
		id: key,
		name: bubblesData[key][0].Stakeholder.stakeholderFullName,
		value: bubblesData[key].length,
		isActive: key === activeId,
	}));
	return {
		name: 'stakeholders',
		children: formattedData.filter((item) => !item.isActive),
	};
};

export default compose(
	withState('images', 'setImages', []),
	withProps(({
		items,
		diameter,
		bubblesPadding,
		activeId,
		radialLayout,
	}) => {
		const formattedItems = formatItems(items, activeId);
		const bubbleLayout = calcBubbleLayout(
			formattedItems,
			radialLayout ? diameter * 0.75 : diameter,
			bubblesPadding,
		).children;

		return {
			bubbleLayoutItems: radialLayout
				? calcForceLayout(
					bubbleLayout,
					diameter,
				)
				: bubbleLayout,
		};
	}),
	withHandlers({
		fetchImages: (props) => (prevProps) => {
			const { bubbleLayoutItems: newItems } = props;
			const { bubbleLayoutItems: oldItems } = prevProps;
			const isFirstRender = (!oldItems || oldItems.length === 0) && (newItems && newItems.length);
			const isSecondRender = !isFirstRender
				&& oldItems
				&& newItems
				&& oldItems.length !== newItems.length;
			if (isFirstRender || isSecondRender) {
				const { bubbleLayoutItems, setImages } = props;
				setImages([]);
				const loadAllImages = bubbleLayoutItems.map((item) => {
					const { id, name } = item.data;
					return getWikipediaImage(name, id, 120).then((url) => ({
						id,
						url,
						size: Math.round(item.r * 2),
						x: item.x - item.r,
						y: item.y - item.r,
					}));
				});

				Promise.all(loadAllImages).then((images) => setImages(images.filter(prop('url'))));
			}
		},
	}),
	lifecycle({
		componentDidUpdate(prevProps) {
			if (prevProps.bubbleLayoutItems === this.props.bubbleLayoutItems) return;
			this.props.fetchImages(prevProps);
		},
	}),
)(BubbleChart);
