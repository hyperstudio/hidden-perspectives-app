import React from 'react';
import PropTypes from 'prop-types';
import MetadataEditView from '../../components/MetadataEditView';
import Header from '../../components/Header';

const EventMetadataEditPage = ({ match }) => (
	<>
		<Header />
		<MetadataEditView id={match.params.id} itemType="event" />
	</>
);

EventMetadataEditPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	}).isRequired,
};

export default EventMetadataEditPage;
