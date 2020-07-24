import React from 'react';
import PropTypes from 'prop-types';
import { getCapsOnlyInitials } from '../../../utils/stringUtil';
import {
	BubbleCircle,
	Container,
	BubbleText,
	BubbleActiveCircle,
} from './styles';

const Bubble = ({
	data,
	x,
	y,
	r,
	setComponentRef,
	hovered,
	setHoveredElement,
	textNodeWidth,
	isLoading,
	image,
	history,
}) => {
	const { name, isActive } = data;
	const id = data[0].Stakeholder.id.trim();

	const maxFontSize = 16;
	const margin = 12;
	const d = Math.round(r * 2);
	const innerD = d - margin;
	let fontSize = maxFontSize;
	const initials = getCapsOnlyInitials(name);
	if (textNodeWidth && textNodeWidth > innerD) {
		fontSize = Math.floor((innerD / textNodeWidth) * fontSize);
		fontSize = Math.min(maxFontSize, fontSize);
	}
	return (
		<Container
			onMouseEnter={() => setHoveredElement({ itemType: 'stakeholder', ...data })}
			onMouseLeave={() => setHoveredElement(null)}
			onClick={(evt) => {
				evt.preventDefault();
				history.push(`/protagonist/context/${id}`);
			}}
			tabIndex={0}
			className={`protagonist-${id}`}
		>
			<BubbleCircle
				cx={x}
				cy={y}
				r={r}
				isLoading={isLoading}
				isHovered={hovered}
				isActive={isActive}
				fill={image ? `url(#image-def-${id})` : undefined}
			/>
			{isActive && (
				<BubbleActiveCircle cx={x} cy={y} r={r - 2} fill="none" />
			)}
			<BubbleText
				x={x}
				y={y}
				isLoading={isLoading}
				isHovered={hovered}
				isActive={isActive}
				fontSize={fontSize > 0 ? fontSize : 0}
				ref={setComponentRef}
				hasImage={Boolean(image)}
			>
				{initials}
			</BubbleText>
		</Container>
	);
};

Bubble.propTypes = {
	data: PropTypes.shape({
		name: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
		isActive: PropTypes.bool,
	}).isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	r: PropTypes.number.isRequired,
	textNodeWidth: PropTypes.number,
	isLoading: PropTypes.bool,
	hovered: PropTypes.bool,
	setComponentRef: PropTypes.func,
	setHoveredElement: PropTypes.func,
	image: PropTypes.shape({
		id: PropTypes.string.isRequired,
		url: PropTypes.string,
		size: PropTypes.number.isRequired,
	}),
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
	}).isRequired,
};

Bubble.defaultProps = {
	isLoading: false,
	hovered: false,
	setComponentRef: () => {},
	setHoveredElement: () => {},
	textNodeWidth: undefined,
	image: undefined,
};

export default Bubble;
