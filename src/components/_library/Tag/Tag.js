import React from 'react';
import PropTypes from 'prop-types';
import { Container, Link } from './styles';

const Tag = ({
	path,
	onClick,
	children,
	...otherProps
}) => (path ? (
	<Link to={path} onClick={onClick}>
		<Container interactive {...otherProps}>
			{children}
		</Container>
	</Link>
) : (
	<Container onClick={onClick} interactive={!!onClick} {...otherProps}>
		{children}
	</Container>
));

Tag.propTypes = {
	path: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
	onClick: PropTypes.func,
};

Tag.defaultProps = {
	path: undefined,
	onClick: undefined,
};

export default Tag;
