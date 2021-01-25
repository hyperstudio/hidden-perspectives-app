import {
	compose,
	lifecycle,
	withState,
	withHandlers,
} from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	pipe,
	prop,
} from 'ramda';
import { withErrors, withLoading, getErrorHandler } from '../../utils/hocUtil';
import OriginalView from './OriginalView';

const FILE_QUERY = gql`
	query GetDocument($id: String) {
		document(where: {id: $id}) {
			id
			documentFiles {
				File{
					id
					url
				}
			}
		}
	}
`;

const getFileUrl = pipe(
	prop('File'),
	prop('url'),
);

const getDataParser = ({ setFile, stopLoading }) => ({ data }) => {
	if (data.document.documentFiles.length > 0) {
		setFile(getFileUrl(data.document.documentFiles[0]));
	} else stopLoading();
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
