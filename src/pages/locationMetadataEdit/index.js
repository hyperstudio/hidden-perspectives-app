import React from 'react';
import PropTypes from 'prop-types';
import MetadataEditView from '../../components/MetadataEditView';
import Header from '../../components/Header';

const LocationMetadataEditPage = ({ match }) => (
	<>
		<Header />
		<MetadataEditView id={match.params.id} itemType="location" />
	</>
);

LocationMetadataEditPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	}).isRequired,
};

export default LocationMetadataEditPage;
