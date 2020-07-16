import React from 'react';
import { compose } from '@hypnosphi/recompose';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const GET_VISIBILITY = gql`
  query GetVisibility {
    visibilityFilter @client
  }
`;

const SET_VISIBILITY = gql`
  mutation SetFilter($filter: String!) {
	setVisibilityFilter(filter: $filter) @client
  }
`;

const VisibilityFilter = ({ visibilityFilter, toggleVisibility }) => (
	<div>
		{visibilityFilter}
		<button type="button" onClick={toggleVisibility}>
			Toggle visibility
		</button>
	</div>
);

VisibilityFilter.propTypes = {
	visibilityFilter: PropTypes.string.isRequired,
	toggleVisibility: PropTypes.func.isRequired,
};

export const withVisibilityFilter = graphql(GET_VISIBILITY, {
	props: ({ data }) => ({
		visibilityFilter: data.visibilityFilter,
	}),
});

export const withVisibilityFilterToggler = graphql(SET_VISIBILITY, {
	props: ({ mutate, ownProps }) => ({
		toggleVisibility: () => mutate({
			variables: {
				filter: ownProps.visibilityFilter === 'SHOW_ALL' ? 'COMPLETED' : 'SHOW_ALL',
			},
		}),
	}),
});

export default compose(
	withVisibilityFilter,
	withVisibilityFilterToggler,
)(VisibilityFilter);

