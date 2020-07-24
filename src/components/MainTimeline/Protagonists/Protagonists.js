import React from 'react';
import PropTypes from 'prop-types';
import BubbleChart from '../../BubbleChart';
import { Container, BubbleChartWrapper } from './styles';

const Stakeholders = (props) => (
	<Container className="tour-protagonists">
		<BubbleChartWrapper>
			<BubbleChart
				{...props}
				diameter={250}
				bubblesPadding={5}
			/>
		</BubbleChartWrapper>
	</Container>
);

Stakeholders.propTypes = {
	items: PropTypes.objectOf(
		PropTypes.arrayOf(
			PropTypes.shape({
				Stakeholder: PropTypes.shape({
					id: PropTypes.string.isRequired,
					stakeholderFullName: PropTypes.string.isRequired,
				}),
			}),
		),
	),
	isLoading: PropTypes.bool,
};

Stakeholders.defaultProps = {
	items: {},
	isLoading: true,
};

export default Stakeholders;
