import {
	compose,
	lifecycle,
	withState,
	withHandlers,
	withProps,
} from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withLoading, withErrors, getErrorHandler } from '../../utils/hocUtil';
import { formatGraphcoolDocument, formatGraphcoolEvent } from '../../utils/graphcoolUtil';
import { ucFirst } from '../../utils/stringUtil';
import Tooltip from './Tooltip';

const EVENT_QUERY = gql`
	query GetEvent($id: ID!) {
		Event(id: $id) {
			id
			eventStartDate
			eventTitle
			eventDescription
		}
	}
`;

const DOCUMENT_QUERY = gql`
	query GetDocument($id: ID!) {
		Document(id: $id) {
			id
			documentTitle
			documentKind {
				id
				name
			}
			documentDescription
			documentFiles {
				id
				url
			}
			documentAuthors {
				id
				stakeholderFullName
			}
		}
	}
`;

const getDataParser = ({
	itemType,
	setTitle,
	setSubtitle,
	setThumbnailUrl,
	setSummary,
	stopLoading,
	setAuthors,
}) => ({ data }) => {
	const item = data[ucFirst(itemType)];
	const {
		title,
		type,
		thumbnailUrl,
		summary,
		authors,
	} = itemType === 'event'
		? formatGraphcoolEvent(item)
		: formatGraphcoolDocument(item);

	setTitle(title);
	setSubtitle(type);
	setThumbnailUrl(thumbnailUrl);
	setSummary(summary);
	setAuthors(authors || []);
	stopLoading();
};

const getPrefetchedData = (prop, prefetchedData) => (
	prefetchedData && prefetchedData[prop]
		? prefetchedData[prop] : undefined
);

export default compose(
	withLoading,
	withErrors,
	withApollo,
	withState('wasHovered', 'setWasHovered', false),
	withState('title', 'setTitle', undefined),
	withState('subtitle', 'setSubtitle', undefined),
	withState('thumbnailUrl', 'setThumbnailUrl', undefined),
	withState('authors', 'setAuthors', []),
	withState('summary', 'setSummary', undefined),
	withProps(({
		itemType,
		id,
		prefetchedData,
		subtitle,
		summary,
		thumbnailUrl,
		authors,
		isLoading,
	}) => ({
		path: `/${itemType}/context/${id}`,
		itemTypeName: ucFirst(itemType),
		subtitle: subtitle || getPrefetchedData('subtitle', prefetchedData),
		summary: summary || getPrefetchedData('summary', prefetchedData),
		thumbnailUrl: thumbnailUrl || getPrefetchedData('thumbnailUrl', prefetchedData),
		authors: authors.length === 0 ? getPrefetchedData('authors', prefetchedData) : authors,
		isLoading: !prefetchedData && isLoading,
	})),
	withHandlers({
		onMouseEnter: ({ setWasHovered }) => () => setWasHovered(true),
	}),
	lifecycle({
		componentDidUpdate(prevProps) {
			const {
				wasHovered,
				client,
				id,
				itemType,
				prefetchedData,
			} = this.props;

			if (!prevProps.wasHovered && wasHovered && !prefetchedData) {
				client.query({
					query: itemType === 'event' ? EVENT_QUERY : DOCUMENT_QUERY,
					variables: { id },
				})
					.then(getDataParser(this.props))
					.catch(getErrorHandler(this.props));
			}
		},
	}),
)(Tooltip);

