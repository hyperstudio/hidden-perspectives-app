import React from 'react';
import PropTypes from 'prop-types';
import {
	LegendLabel,
	MainTimelineContainer,
	LegendContainer,
	ProtagonistLegendContainer,
	TimelineLegends,
} from './styles';

const getCountSuffix = (label, count, isLoading) => (
	isLoading ? label : `${label} (${count})`
);

const legendProptypes = {
	position: PropTypes.oneOf(['left', 'center', 'right']),
	itemCount: PropTypes.number,
	isLoading: PropTypes.bool,
};

const legendDefaultProps = {
	position: 'left',
	itemCount: 0,
	isLoading: true,
};

const createLegendComponent = (label, itemType) => {
	const Legend = ({ position, itemCount, isLoading }) => (
		<LegendLabel itemType={itemType} position={position}>
			{getCountSuffix(label, itemCount, isLoading)}
		</LegendLabel>
	);

	Legend.propTypes = legendProptypes;
	Legend.defaultProps = legendDefaultProps;

	return Legend;
};

export const DocumentLegend = createLegendComponent('Documents', 'document');
export const EventLegend = createLegendComponent('Events', 'event');
export const ProtagonistLegend = createLegendComponent('Stakeholders', 'stakeholder');

export const MainTimelineLegend = ({
	documentsCount,
	eventsCount,
	protagonistsCount,
	isLoading,
}) => (
	<MainTimelineContainer>
		<TimelineLegends>
			<LegendContainer position="left">
				<DocumentLegend
					itemCount={documentsCount}
					isLoading={isLoading}
					position="left"
				/>
			</LegendContainer>
			<LegendContainer position="right">
				<EventLegend
					itemCount={eventsCount}
					isLoading={isLoading}
					position="right"
				/>
			</LegendContainer>
		</TimelineLegends>
		<ProtagonistLegendContainer>
			<LegendContainer position="center">
				<ProtagonistLegend
					itemCount={protagonistsCount}
					isLoading={isLoading}
					position="center"
				/>
			</LegendContainer>
		</ProtagonistLegendContainer>
	</MainTimelineContainer>
);

MainTimelineLegend.propTypes = {
	documentsCount: legendProptypes.itemCount,
	eventsCount: legendProptypes.itemCount,
	protagonistsCount: legendProptypes.itemCount,
	isLoading: legendProptypes.isLoading,
};

MainTimelineLegend.defaultProps = {
	documentsCount: legendDefaultProps.itemCount,
	eventsCount: legendDefaultProps.itemCount,
	protagonistsCount: legendDefaultProps.itemCount,
	isLoading: legendDefaultProps.isLoading,
};
