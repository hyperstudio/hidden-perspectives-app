import React from 'react';
import PropTypes from 'prop-types';
import DetailView from '../../components/DetailView';
import Header from '../../components/Header';
import NodeHeader from '../../components/NodeHeader';

const EventPage = ({ match }) => (
	<div className="EventPage">
		<Header />
		<NodeHeader id={match.params.id} itemType="event" />
		<DetailView id={match.params.id} itemType="event" />
	</div>
);

EventPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	}).isRequired,
};

export default EventPage;

