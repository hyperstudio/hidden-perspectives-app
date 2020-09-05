import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'ramda';
import FeaturesTour from '../FeaturesTour';
import { LoadingContainer } from '../LoadingIndicator/styles';
import LoadingIndicator from '../LoadingIndicator';
import { MainTimelineLegend } from '../Legend';
import Errors from '../Errors';
import Alerts from '../Alerts';
import Minimap from './Minimap';
import TimelineItems from './TimelineItems';
import Protagonists from './Protagonists';
import { Container } from './styles';

const parseTimelineItems = (years) => {
	const months = years.reduce((acc, cur) => {
		if (!cur.months) return acc;
		return [...acc, ...cur.months];
	}, []);

	return months;
};

const MainTimeline = ({
	timelineItems,
	minimapItems,
	bubbleChartItems,
	errors,
	alerts,
	isLoading,
	fetchingProtagonists,
	setHoveredElement,
	hoveredElement,
	eventsCount,
	documentsCount,
	protagonistsCount,
	activeRowIndex,
	setActiveRowIndex,
	activeYear,
	setActiveYear,
	onTimelineScroll,
	tourIsOpen,
	onCloseTour,
}) => {
	const items = parseTimelineItems(timelineItems);

	return (
		<Container id="mainTimeline">
			<FeaturesTour
				page="mainTimeline"
				isOpen={tourIsOpen}
				onClose={onCloseTour}
			/>
			<LoadingContainer isLoading={isLoading}>
				<LoadingIndicator />
			</LoadingContainer>
			<Errors errors={errors} />
			<Alerts alerts={alerts} />
			<Minimap
				isLoading={isLoading}
				items={minimapItems}
				activeYear={activeYear}
				activeRowIndex={activeRowIndex}
				onClick={(year) => {
					const indexOfFirstItem = findIndex(({ key }) => key === `${year}-1`, items);
					setActiveRowIndex(indexOfFirstItem);
					setActiveYear(year);
				}}
			/>
			<Protagonists
				isLoading={fetchingProtagonists}
				items={bubbleChartItems}
				hoveredElement={hoveredElement}
				setHoveredElement={setHoveredElement}
			/>
			<MainTimelineLegend
				isLoading={isLoading}
				eventsCount={eventsCount}
				documentsCount={documentsCount}
				protagonistsCount={protagonistsCount}
			/>
			{items.length > 0 && (
				<TimelineItems
					timelineItems={items}
					hoveredElement={hoveredElement}
					setHoveredElement={setHoveredElement}
					activeRowIndex={activeRowIndex}
					setActiveYear={setActiveYear}
					onTimelineScroll={onTimelineScroll}
				/>
			)}
		</Container>
	);
};

MainTimeline.propTypes = {
	timelineItems: TimelineItems.propTypes.timelineItems,
	minimapItems: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		density: PropTypes.number.isRequired,
	})),
	eventsCount: PropTypes.number.isRequired,
	documentsCount: PropTypes.number.isRequired,
	protagonistsCount: PropTypes.number.isRequired,
	bubbleChartItems: Protagonists.propTypes.items,
	hoveredElement: TimelineItems.propTypes.hoveredElement,
	setHoveredElement: PropTypes.func,
	errors: PropTypes.arrayOf(PropTypes.string),
	alerts: PropTypes.arrayOf(
		PropTypes.shape({
			message: PropTypes.string.isRequired,
			variant: PropTypes.string.isRequired,
		}),
	),
	isLoading: PropTypes.bool,
	fetchingProtagonists: PropTypes.bool,
	tourIsOpen: PropTypes.bool,
	onTimelineScroll: PropTypes.func,
	setActiveRowIndex: PropTypes.func,
	activeRowIndex: PropTypes.number,
	setActiveYear: PropTypes.func,
	activeYear: PropTypes.string,
	onCloseTour: PropTypes.func,
};

MainTimeline.defaultProps = {
	hoveredElement: TimelineItems.defaultProps.hoveredElement,
	setHoveredElement: () => {},
	timelineItems: TimelineItems.defaultProps.timelineItems,
	bubbleChartItems: Protagonists.defaultProps.items,
	minimapItems: [],
	errors: [],
	alerts: [],
	isLoading: true,
	tourIsOpen: false,
	fetchingProtagonists: true,
	onTimelineScroll: () => {},
	setActiveRowIndex: () => {},
	setActiveYear: () => {},
	onCloseTour: () => {},
	activeRowIndex: 300,
	activeYear: '1993',
};

export default MainTimeline;
