import styled from 'styled-components';
import { Button as SmoothUiButton } from '@smooth-ui/core-sc';
import { NavLink } from 'react-router-dom';

const isPrimary = (variant) => (variant === 'primary');
const isDanger = (variant) => (variant === 'danger');

export const Button = styled(SmoothUiButton)`
	font-weight: ${({ theme, variant }) => ((isPrimary(variant) || isDanger(variant))
		? theme.btnPrimaryFontWeight
		: theme.bthSecondaryFontWeight
	)};
	font-size: ${({ theme }) => theme.btnFontSize};

	background: ${({ variant, theme }) => (isPrimary(variant)
		? theme.btnPrimaryBackground
		: theme.bthSecondaryBackground
	)};
	color: ${({ variant, theme }) => (isPrimary(variant)
		? theme.btnPrimaryColor
		: theme.bthSecondaryColor
	)};

	border-width: ${({ theme }) => theme.btnBorderWidth};
	border-style: solid;
	border-color: ${({ variant, theme }) => {
		if (isPrimary(variant)) return theme.btnPrimaryBorderColor;
		if (isDanger(variant)) return '#ce1126';
		return theme.btnSecondaryBorderColor;
	}};

	padding: .875rem 1rem .75rem;
	user-select: none;

	&,
	&:hover,
	&.active:not(.active):hover,
	&:not(.active):hover {
		text-decoration: none;
	}
`;

export const Link = styled(NavLink)`
	display: inline-block;
`;
