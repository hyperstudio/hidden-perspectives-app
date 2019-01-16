import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const BubbleChartContainer = styled.div`
    border-radius: 50%;
    height: 100%;
    position: absolute;
    width: 100%;

    &:before{
        content: '';
        display: block;
        margin-top: 100%;
    }
`;

export const Tooltip = styled.div`
    background: ${({ theme }) => theme.primary};
    border-radius: 1rem;
    font-size: .875rem;
    line-height: 1.5rem;
    left: ${({ position }) => position.x}px;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    padding: 0 .75rem;
    pointer-events: none;
    position: fixed;
    top: ${({ position }) => position.y}px;
    transform: translate(-50%, -50%);
    transition: opacity 150ms ease-out;
`;

export const BubbleLink = styled(NavLink)`
    pointer-events: all;
`;

export const BubblesSvg = styled.svg`
    display: block;
    height: 100%;
    left: 50%;
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: auto;
`;

export const BubblesLoadingContainer = styled.div`
	position: absolute;
	width: 8rem;
	height: 8rem;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
	opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
	transition: opacity 200ms ease-out;
`;

export const Bubble = styled.circle`
    align-items: center;
    height: ${({ r }) => r * 2}px;
    fill: ${({ isHovered, theme }) => (isHovered ? theme.primaryLight : theme.gray200)};
    left: ${({ x }) => x}px;
    opacity: ${({ isLoading }) => (isLoading ? 0 : 1)};
`;

export const Text = styled.text`
    alignment-baseline: central;
    fill: ${({ isActive }) => (isActive ? 'white' : 'black')};
    font-size: ${({ fontSize }) => fontSize}px;
    line-height: ${({ fontSize }) => fontSize}px;
    opacity: ${({ isLoading }) => (isLoading ? 0 : 1)};
    pointer-events: none;
    text-anchor: middle;
    transition: fill 400ms ease-out;
    fill: ${({ isHovered, theme }) => (isHovered ? theme.primaryDark : theme.gray900)};
`;
