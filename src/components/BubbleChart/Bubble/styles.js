import styled from 'styled-components';
import { Text } from '../styles';

export const Container = styled.g`
	pointer-events: all;
	cursor: pointer;

	&:focus {
		outline: none;
	}
`;

const getFilterUrl = ({ isHovered, isActive }) => {
	if (isHovered) return '#image-color-filter-hover';
	if (isActive) return 'none';
	return '#image-color-filter';
};

export const BubbleActiveCircle = styled.circle.attrs({
	style: ({ r }) => ({
		height: `${r * 2}px`,
	}),
})`
	stroke-width: 4px;
	stroke: ${({ theme }) => theme.primary};
`;

export const BubbleCircle = styled.circle.attrs(({ r }) => ({
	style: { height: `${r * 2}px` },
}))`
	align-items: center;
	${({
		fill,
		isHovered,
		theme,
	}) => {
		if (fill) return '';
		const colorFill = (isHovered ? theme.primaryLight : theme.gray200);
		return `fill: ${colorFill};`;
	}}
	opacity: ${({ isLoading }) => (isLoading ? 0 : 1)};
	filter: url(${getFilterUrl});
	font-weight: bold;
	stroke-width: 1px;
	stroke: ${({ theme }) => theme.commonBorderColor};
`;

export const BubbleText = styled(Text)`
	${({
		hasImage,
		isHovered,
		isActive,
	}) => hasImage && (isHovered || isActive) && `
		opacity: 0;
	`}
	user-select: none;
`;
