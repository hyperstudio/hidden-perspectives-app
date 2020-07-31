import React from 'react';
import PropTypes from 'prop-types';
import MetadataEditView from '../../components/MetadataEditView';
import Header from '../../components/Header';
import NodeHeader from '../../components/NodeHeader';

const DocumentMetadataEditPage = ({ match }) => (
	<>
		<Header />
		<NodeHeader id={match.params.id} itemType="document" />
		<MetadataEditView id={match.params.id} itemType="document" />
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
