import React from 'react';
import PropTypes from 'prop-types';
import MetadataEditView from '../../components/MetadataEditView';
import Header from '../../components/Header';

const DocumentMetadataEditPage = ({ match }, props) => (
	<>
		<Header />
		<MetadataEditView id={match.params.id} itemType="document" {...props} />
	</>
);

DocumentMetadataEditPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	}).isRequired,
};

export default DocumentMetadataEditPage;
