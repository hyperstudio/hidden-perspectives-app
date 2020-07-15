import { compose, withState, lifecycle } from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withLoading, withErrors, getErrorHandler } from '../../utils/hocUtil';
import TranscriptView from './TranscriptView';

const TRANSCRIPT_QUERY = gql`
	query GetDocument($id: ID!) {
		Document(id: $id) {
			id
			documentTranscript
		}
	}
`;


const getDataParser = ({ setTranscript, stopLoading }) => ({ data }) => {
	setTranscript(data.Document.documentTranscript);
	stopLoading();
};

export default compose(
	withApollo,
	withErrors,
	withLoading,
	withState('transcript', 'setTranscript', ''),
	lifecycle({
		componentDidMount() {
			const { id, client } = this.props;

			client.query({
				query: TRANSCRIPT_QUERY,
				variables: { id },
			})
				.then(getDataParser(this.props))
				.catch(getErrorHandler(this.props));
		},
	}),
)(TranscriptView);
