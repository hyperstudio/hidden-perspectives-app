import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './styles';

const getVariant = (primary, danger) => {
	if (primary) return 'primary';
	if (danger) return 'danger';
	return 'light';
};

const CustomButton = ({
	to,
	children,
	primary,
	danger,
	className,
	history,
	onClick,
}) => (to ? (
	<Button
		variant={getVariant(primary, danger)}
		className={className}
		onClick={(evt) => {
			history.push(to);
			if (onClick) onClick(evt);
		}}
	>
		{children}
	</Button>
) : (
	<Button
		variant={getVariant(primary, danger)}
		className={className}
		onClick={onClick}
	>
		{children}
	</Button>
));

CustomButton.propTypes = {
	primary: PropTypes.bool,
	danger: PropTypes.bool,
	to: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
		PropTypes.node,
	]).isRequired,
	className: PropTypes.string,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
	}).isRequired,
	onClick: PropTypes.func,
};

CustomButton.defaultProps = {
	to: undefined,
	primary: false,
	danger: false,
	className: '',
	onClick: undefined,
};

export default CustomButton;
