import React from 'react';
import PropTypes from 'prop-types';
import { LegendLabel, MainTimelineContainer } from './styles';

export const DocumentLegend = ({ right }) => (
	<LegendLabel symbol="■" right={right}>Documents</LegendLabel>
);

export const EventLegend = ({ right }) => (
	<LegendLabel symbol="●" right={right}>Events</LegendLabel>
);

export const MainTimelineLegend = () => (
	<MainTimelineContainer>
		<DocumentLegend />
		<EventLegend right />
	</MainTimelineContainer>
);

const legendProptypes = {
	right: PropTypes.bool,
};

const legendDefaultProps = {
	right: false,
};

DocumentLegend.propTypes = legendProptypes;
EventLegend.propTypes = legendProptypes;

DocumentLegend.defaultProps = legendDefaultProps;
EventLegend.defaultProps = legendDefaultProps;
