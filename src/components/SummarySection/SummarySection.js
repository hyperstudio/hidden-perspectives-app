import React from 'react';
import PropTypes from 'prop-types';
import { formatHumanDate } from '../../utils/dateUtil';
import { ucFirst } from '../../utils/stringUtil';
import { isHovered } from '../../utils/timelineUtil';
import Summary from './Summary';
import { Items } from './styles';

const SummarySection = ({
	items,
	setHoveredElement,
	filteredTags,
	tags,
	history,
	...props
}) => (
	<Items id="summary-section" className="tour-related-entries-list">
		{items.map((item) => {
			const itemType = item.type === 'Event' ? 'event' : 'document';
			const { hoveredElement } = props;
			const isIncluded = filteredTags.length === tags.length
				|| filteredTags.length === 0
				|| !!filteredTags.find((filteredTag) => item.commonTags
					.find(({ id }) => filteredTag === id));
			if (!isIncluded) return null;
			return (
				<Summary
					key={item.id}
					{...props}
					{...item}
					type={ucFirst(item.type)}
					date={formatHumanDate(item.date)}
					itemType={itemType}
					hovered={isHovered(item, hoveredElement, itemType)}
					hoverHandler={setHoveredElement}
					clickHandler={() => history
						.push(`/${itemType === 'stakeholder' ? 'protagonist' : itemType}/context/${item.id}`)
					}
				/>
			);
		})}
	</Items>
);

SummarySection.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		date: PropTypes.instanceOf(Date).isRequired,
		type: PropTypes.string.isRequired,
		summary: PropTypes.string,
	})),
	setHoveredElement: PropTypes.func,
	filteredTags: PropTypes.arrayOf(PropTypes.string).isRequired,
	tags: PropTypes.arrayOf(PropTypes.shape({
		Tag: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	})).isRequired,
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
	isLoading: PropTypes.bool,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
	}).isRequired,
};

SummarySection.defaultProps = {
	items: [],
	hoveredElement: null,
	setHoveredElement: () => { },
	isLoading: true,
};

export default SummarySection;

