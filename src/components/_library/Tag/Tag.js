import React from 'react';
import PropTypes from 'prop-types';
import { Container, Link } from './styles';

const Tag = ({
	path,
	onClick,
	children,
	type,
	...otherProps
}) => (path ? (
	<Link to={path} onClick={onClick}>
		<Container interactive {...otherProps}>
			{children}
		</Container>
	</Link>
) : (
	<Container onClick={onClick} interactive={!!onClick} {...otherProps}>
		{(type === 'document' || type === 'event') && (
			<img src={`/icons/${type}.svg`} alt="Document" />
		)}
		{children}
	</Container>
));

Tag.propTypes = {
	path: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
	onClick: PropTypes.func,
	type: PropTypes.string,
};

Tag.defaultProps = {
	path: undefined,
	onClick: undefined,
	type: 'tag',
};

export default Tag;
