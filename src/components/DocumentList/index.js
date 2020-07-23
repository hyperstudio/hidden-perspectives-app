import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import DocumentList from './DocumentList';

const ALL_DOCUMENTS_QUERY = gql`
	query allDocuments {
	  documents {
			id
			documentTitle
			documentOriginalID
	  }
	}
`;

export default () => (
	<Query query={ALL_DOCUMENTS_QUERY}>
		{({ loading, error, data }) => {
			if (loading) return 'Loading...';
			if (error) return `Error! ${error.message}`;

			return <DocumentList documents={data.allDocuments} />;
		}}
	</Query>
);

