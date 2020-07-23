import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'react-virtualized';
import throttle from 'lodash.throttle';
import TimelineElement from '../TimelineElement';
import { isHovered } from '../../../utils/timelineUtil';
import { monthsLabels } from '../../../utils/dateUtil';
import {
	EventContainer, Event, EventDate, Events, Documents, Year,
} from './styles';
import { estimatedMonthHeight } from './utils';
import ContainerWithStickyLabel from '../ContainerWithStickyLabel';

const saveLastScrollIndex = (rowIndex) => {
	const DEFAULT_SCROLL_ROW = 267;
	if (rowIndex !== DEFAULT_SCROLL_ROW) {
		window.lastScrolledRow = rowIndex;
	}
};

class TimelineItemsClass extends React.PureComponent {
	constructor(props) {
		super(props);

		this.onRowsRendered = throttle(this.onRowsRendered.bind(this), 200);
		this.handleScroll = throttle(this.handleScroll.bind(this), 100);
		this.rowRenderer = this.rowRenderer.bind(this);
		this.timelineEl = React.createRef();
	}

	onRowsRendered({ startIndex, stopIndex }) {
		const data = this.props.timelineItems.slice(startIndex, stopIndex);
		const protagonists = {};

		saveLastScrollIndex(startIndex);

		data.forEach((month) => {
			month.days.forEach((day) => {
				const items = [...day.events, ...day.documents];
				if (items.length === 0) return;

				items.forEach((item) => {
					if (!item.mentionedStakeholders) return;
					item.mentionedStakeholders.forEach(({ Stakeholder: { stakeholderFullName, id } }) => {
						if (protagonists[stakeholderFullName]) {
							protagonists[stakeholderFullName].value += 1;
						} else {
							protagonists[stakeholderFullName] = {
								value: 1,
								id,
							};
						}
					});
				});
			});
		});
	}

	handleScroll() {
		this.props.onTimelineScroll(this.timelineEl.current);
		const monthBlocks = document.getElementsByClassName('timeline-month');
		const indexInTheMiddle = Math.round(monthBlocks.length / 2) - 1;
		const monthInTheMiddle = monthBlocks[indexInTheMiddle];
		const year = monthInTheMiddle.getAttribute('data-year');
		if (this.props.activeYear === year) return;
		this.props.setActiveYear(year);
	}

	rowRenderer({ index, key, style }) {
		const { hoveredElement, setHoveredElement } = this.props;
		const data = this.props.timelineItems[index];
		if (!data) return null;
		const { days, dateUnitIndex } = data;
		const monthLabel = monthsLabels[dateUnitIndex - 1];

		const mapTimelineItem = (itemType) => (item) => (
			<TimelineElement
				key={item.id}
				{...item}
				itemType={itemType}
				hoveredElement={hoveredElement}
				hovered={isHovered(item, hoveredElement, itemType)}
				hoverHandler={setHoveredElement}
			/>
		);

		const year = data.key.split('-')[0];
		return (
			<div style={style} key={key} className={`timeline-month timeline-month-${monthLabel}-${year}`} data-year={year}>
				{dateUnitIndex === 1 && <Year>{year}</Year>}
				<ContainerWithStickyLabel
					isEmpty={days.length === 0}
					label={monthLabel}
					date={`${monthLabel} ${year}`}
				>
					{days.map(({
						dateUnitIndex: dayIndex,
						key: dayKey,
						events,
						documents,
					}) => (
						<EventContainer key={dayKey}>
							<Event>
								<EventDate>{dayIndex}</EventDate>
								<Documents>
									{documents.map(mapTimelineItem('document'))}
								</Documents>
								<Events>{events.map(mapTimelineItem('event'))}</Events>
							</Event>
						</EventContainer>
					))}
				</ContainerWithStickyLabel>
			</div>
		);
	}

	render() {
		return (
			<div ref={this.timelineEl} className="tour-main-timeline">
				<List
					height={1200}
					overscanRowCount={0}
					rowHeight={({ index }) => estimatedMonthHeight(this.props.timelineItems[index])}
					onScroll={this.handleScroll}
					rowRenderer={this.rowRenderer}
					onRowsRendered={this.onRowsRendered}
					rowCount={this.props.timelineItems.length}
					scrollToIndex={this.props.activeRowIndex}
					scrollToAlignment="start"
					width={window.innerWidth - 384}
				/>
			</div>
		);
	}
}

TimelineItemsClass.propTypes = {
	timelineItems: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string.isRequired,
			dateUnitIndex: PropTypes.number.isRequired,
			days: PropTypes.arrayOf(
				PropTypes.shape({
					key: PropTypes.string.isRequired,
					dateUnitIndex: PropTypes.number.isRequired,
					events: PropTypes.arrayOf(
						PropTypes.shape({
							id: PropTypes.string.isRequired,
							title: PropTypes.string.isRequired,
							date: PropTypes.instanceOf(Date).isRequired,
						}),
					),
					documents: PropTypes.arrayOf(
						PropTypes.shape({
							id: PropTypes.string.isRequired,
							title: PropTypes.string.isRequired,
							date: PropTypes.instanceOf(Date).isRequired,
						}),
					),
				}),
			),
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
	setHoveredElement: PropTypes.func,
	setActiveRowIndex: PropTypes.func,
	onTimelineScroll: PropTypes.func,
	activeRowIndex: PropTypes.number,
	activeYear: PropTypes.string,
	setActiveYear: PropTypes.func,
};

TimelineItemsClass.defaultProps = {
	hoveredElement: null,
	timelineItems: [],
	setHoveredElement: () => {},
	setActiveRowIndex: () => {},
	onTimelineScroll: () => {},
	activeRowIndex: 300,
	activeYear: '1993',
	setActiveYear: () => {},
};

export default TimelineItemsClass;
