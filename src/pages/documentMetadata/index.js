import React from 'react';
import PropTypes from 'prop-types';
import MetadataView from '../../components/MetadataView';
import Header from '../../components/Header';
import NodeTitle from '../../components/NodeTitle';
import NodeHeader from '../../components/NodeHeader';

const DocumentMetadataPage = ({ match }) => (
	<div className="MetadataPage">
		<Header>
			<NodeTitle
				id={match.params.id}
				itemType="document"
			/>
		</Header>
		<NodeHeader id={match.params.id} itemType="document" />
		<MetadataView id={match.params.id} itemType="document" />
	</div>
);

DocumentMetadataPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	}).isRequired,
};

export default DocumentMetadataPage;
