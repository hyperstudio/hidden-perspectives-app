import {
	pipe,
	isEmpty,
	prepend,
	take,
	drop,
	curry,
	groupBy,
	prop,
	sort,
} from 'ramda';
import { scaleLinear } from 'd3-scale';
import { TIMELINE_EVENT_HEIGHT, MINIMAP_EVENT_HEIGHT } from '../state/constants';
import reOrganizeItems from './reorganizeUtil';

const groupsOf = curry(function group(n, list) {
	return isEmpty(list) ? [] : prepend(take(n, list), group(n, drop(n, list)));
});

export const getMinimap = (timelineItems) => {
	const allMonths = timelineItems.reduce((acc, { months }) => [...acc, ...months], []);
	const groupedMonts = groupsOf(12, allMonths);
	const getEventsAndDocumentsLength = ({ events, documents }) => (
		events.length + documents.length
	);
	const yearGroups = groupedMonts.map((monthsGroup) => {
		const months = monthsGroup.map(prop('key'));
		const count = monthsGroup.reduce((acc2, { days }) => (
			acc2 + days.reduce((acc3, day) => (
				acc3 + getEventsAndDocumentsLength(day)
			), 0)
		), 0);
		return { months, count };
	});
	const sortedMonths = sort((a, b) => {
		if (a.count < b.count) return -1;
		if (a.count > b.count) return 1;
		return 0;
	}, yearGroups);

	const minimapColorScale = scaleLinear()
		.domain([0, sortedMonths[sortedMonths.length - 1].count])
		.range([1, 0.1, 0]);

	return yearGroups.map(({ months, count }) => ({
		count,
		density: minimapColorScale(count),
		id: months.join('-'),
		year: months[0].split('-')[0],
	}));
};

export const groupItemsBy = (list, groupName) => pipe(
	groupBy(prop(groupName)),
	Object.values,
)(list);

const getUnitRouderByUnit = (unit) => (value) => value - (value % unit);
export const roundToTimelineUnit = getUnitRouderByUnit(TIMELINE_EVENT_HEIGHT);
export const roundToMinimapUnit = getUnitRouderByUnit(MINIMAP_EVENT_HEIGHT);

const HEAD_OFFSET = 108;
export const isPartlyInViewport = (element) => {
	if (!element) return false;
	const { top, bottom } = element.getBoundingClientRect();
	const topIsAboveUpperBound = top < HEAD_OFFSET;
	const bottomIsAboveUpperBound = bottom < HEAD_OFFSET;
	const topIsUnderLowerBound = top > window.innerHeight;
	const bottomIsUnderLowerBound = bottom > window.innerHeight;
	const isFullyOutOfTheView = (topIsAboveUpperBound && bottomIsAboveUpperBound)
		|| (topIsUnderLowerBound && bottomIsUnderLowerBound);
	return !isFullyOutOfTheView;
};

export const isFullyInViewport = (element) => {
	if (!element) return false;
	const { top, bottom } = element.getBoundingClientRect();
	const topIsBelowUpperBound = top >= HEAD_OFFSET;
	const bottomIsAboveLowerBound = bottom <= window.innerHeight;
	return topIsBelowUpperBound && bottomIsAboveLowerBound;
};

const isDocumentHovered = (item, hoveredElement) => {
	if (hoveredElement.itemType === 'event') return false;
	if (hoveredElement.itemType === 'tag') {
		return !!item.commonTags.find((tag) => tag.id === hoveredElement.id);
	}
	return !!reOrganizeItems(item
		.mentionedStakeholders, 'stakeholder').find(({ id }) => id === hoveredElement.id);
};

const isEventHovered = (item, hoveredElement) => {
	if (hoveredElement.itemType === 'document') return false;
	if (hoveredElement.itemType === 'tag') {
		return !!item.commonTags.find((tag) => tag.id === hoveredElement.id);
	}
	return !!reOrganizeItems(item
		.eventStakeholders, 'stakeholder').find(({ id }) => id === hoveredElement.id);
};

const isStakeholderHovered = (item, hoveredElement) => {
	if (hoveredElement.itemType === 'document') {
		return !!reOrganizeItems(hoveredElement
			.mentionedStakeholders, 'stakeholder').find(({ id }) => id === item.id);
	}
	if (hoveredElement.itemType === 'event') {
		return !!reOrganizeItems(hoveredElement.eventStakeholders, 'stakeholder').find(({ id }) => id === item.id);
	}
	return false;
};

const isItemHovered = (item, hoveredElement, itemType) => {
	if (itemType === hoveredElement.itemType) return item.id === hoveredElement.id;
	switch (itemType) {
	case 'document': return isDocumentHovered(item, hoveredElement);
	case 'event': return isEventHovered(item, hoveredElement);
	case 'stakeholder': return isStakeholderHovered(item, hoveredElement);
	default: return false;
	}
};

export const isHovered = (item, hoveredElement, itemType) => {
	if (!hoveredElement) return false;
	if (Array.isArray(item) && Array.isArray(hoveredElement)) {
		return item.some(
			(el) => hoveredElement.some((hoveredEl) => isItemHovered(el, hoveredEl, itemType)),
		);
	}
	if (Array.isArray(item)) return item.some((el) => isItemHovered(el, hoveredElement, itemType));
	if (Array.isArray(hoveredElement)) {
		return hoveredElement.some((hoveredEl) => isItemHovered(item, hoveredEl, itemType));
	}
	return isItemHovered(item, hoveredElement, itemType);
};

const getSummaryElementById = (id) => document.getElementById(`summary-${id}`);
export const getHoveredSummary = (hoveredElement) => {
	const indexInMiddle = Math.round((hoveredElement.length - 1) / 2);
	return getSummaryElementById(hoveredElement[indexInMiddle].id);
};
