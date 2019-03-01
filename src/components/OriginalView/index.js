import {
	compose,
	lifecycle,
	withState,
	withHandlers,
} from 'recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	defaultTo,
	head,
	pipe,
	prop,
} from 'ramda';
import { withErrors, withLoading, getErrorHandler } from '../../utils/hocUtil';
import OriginalView from './OriginalView';

const FILE_QUERY = gql`
	query GetDocument($id: ID!) {
		Document(id: $id) {
			id
			documentFiles {
				id
				url
			}
		}
	}
`;

const getFileUrl = pipe(
	prop('documentFiles'),
	defaultTo({}, head),
	prop('url'),
);

const getDataParser = ({ setFile }) => ({ data }) => {
	setFile(getFileUrl(data.Document));
};

export default compose(
	withApollo,
	withErrors,
	withLoading,
	withState('isZoomed', 'setIsZoomed', true),
	withState('file', 'setFile', undefined),
	withState('pagesCount', 'setPagesCount', 0),
	withHandlers({
		toggleZoom: ({ isZoomed, setIsZoomed }) => () => setIsZoomed(!isZoomed),
	}),
	lifecycle({
		componentDidMount() {
			const { id, client } = this.props;
			client.query({
				query: FILE_QUERY,
				variables: { id },
			})
				.then(getDataParser(this.props))
				.catch(getErrorHandler(this.props));
		},
	}),
)(OriginalView);
