import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../Tooltip';
import IconItem from '../../IconItem';
import {
	Container,
	EventTitleContainer,
	EventTitle,
	IconContainer,
} from './styles';

const TimelineElement = ({
	itemType,
	id,
	hovered,
	path,
	title,
	hoverHandler,
	history,
	...itemProps
}) => (
	<Container>
		<EventTitleContainer
			className={[
				'timeline-event',
				hovered ? 'hovered' : '',
			].join(' ')}
			data-id={id.trim()}
			right={itemType === 'document'}
			onMouseEnter={() => hoverHandler({ id, itemType, ...itemProps })}
			onMouseLeave={() => hoverHandler(null)}
			onClick={() => history.push(`/${itemType === 'stakeholder' ? 'protagonist' : itemType}/context/${id}`)}
			tabIndex={0}
		>
			<IconContainer>
				<IconItem itemType={itemType} hovered={hovered} size={18} />
			</IconContainer>
			<Tooltip
				id={id.trim()}
				itemType={itemType}
				position={itemType === 'document' ? 'right' : 'left'}
				noTitle
			>
				<EventTitle>
					{title}
				</EventTitle>
			</Tooltip>
		</EventTitleContainer>
	</Container>
);

TimelineElement.propTypes = {
	itemType: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	hoverHandler: PropTypes.func.isRequired,
	hovered: PropTypes.bool.isRequired,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
	}).isRequired,
};

export default TimelineElement;
