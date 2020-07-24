import React from 'react';
import PropTypes from 'prop-types';

const GradientMapFilter = ({
	id,
	red,
	green,
	blue,
}) => (
	<filter id={id}>
		<feColorMatrix
			type="matrix"
			values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 1 0"
			in="SourceGraphic"
			result="colormatrix"
		/>
		<feComponentTransfer in="colormatrix" result="componentTransfer">
			<feFuncR type="table" tableValues={red} />
			<feFuncG type="table" tableValues={green} />
			<feFuncB type="table" tableValues={blue} />
			<feFuncA type="table" tableValues="0 1" />
		</feComponentTransfer>
		<feBlend
			mode="normal"
			in="componentTransfer"
			in2="SourceGraphic"
			result="blend"
		/>
	</filter>
);

GradientMapFilter.propTypes = {
	id: PropTypes.string.isRequired,
	red: PropTypes.string.isRequired,
	green: PropTypes.string.isRequired,
	blue: PropTypes.string.isRequired,
};

const BubbleChartImages = ({ images }) => (
	<defs>
		<GradientMapFilter
			id="image-color-filter"
			red="0.3 0.87"
			green="0.34 0.89"
			blue="0.38 0.9"
		/>
		<GradientMapFilter
			id="image-color-filter-hover"
			red="0.39 0.8 1"
			green="0.15 0.57 0.93"
			blue="0.06 0.33 0.78"
		/>

		{images.map(({
			id,
			url,
			size,
			x,
			y,
		}) => (
			<pattern
				key={id.trim()}
				id={`image-def-${id.trim()}`}
				x={x}
				y={y}
				patternUnits="userSpaceOnUse"
				height={size}
				width={size}
			>
				<image
					x="0"
					y="0"
					xlinkHref={url}
					preserveAspectRatio="xMinYMin slice"
					width={size}
					height={size}
				/>
			</pattern>
		))}
	</defs>
);

BubbleChartImages.propTypes = {
	images: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		url: PropTypes.string,
		size: PropTypes.number.isRequired,
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
	})),
};

BubbleChartImages.defaultProps = {
	images: [],
};

export default BubbleChartImages;
