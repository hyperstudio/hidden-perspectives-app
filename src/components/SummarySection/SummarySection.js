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
	history,
	...props
}) => (
	<Items id="summary-section">
		{items.map((item) => {
			const itemType = item.type === 'Event' ? 'event' : 'document';
			const { hoveredElement } = props;
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

