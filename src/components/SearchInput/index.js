import {
	compose,
	withHandlers,
	lifecycle,
} from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import debounce from 'lodash.debounce';
import { getErrorHandler } from '../../utils/hocUtil';
import { getSearchQuery, handleSearchResults, withSearch } from './utils';
import Search from './SearchInput';

let lastRequest;
const requestLast = (request) => new Promise((resolve, reject) => {
	lastRequest = request;
	request
		.then((res) => {
			if (lastRequest !== request) return;
			resolve(res);
		})
		.catch((err) => {
			if (lastRequest !== request) return;
			reject(err);
		});
});

const performQuery = debounce((props) => {
	if (document.getElementById(`search-bar-${props.type}`)) {
		const { value } = document.getElementById(`search-bar-${props.type}`);
		requestLast(props.client.query({
			query: getSearchQuery(10),
			variables: { searchQuery: value },
		}))
			.then(handleSearchResults(props, value))
			.catch(getErrorHandler(props, value));
	}
}, 350, { leading: false, trailing: true });

const getOnKeyUpHandler = ({
	onArrow,
	onEnter,
	onEscape,
	type,
}) => function onKeyUpHandler(evt) {
	if (!document.querySelector(`#search-bar-${type}:focus`)) return undefined;
	if (evt.code === 'Enter') return onEnter(evt);
	if (evt.code === 'Escape') return onEscape(evt);
	if (evt.code === 'ArrowDown' || evt.code === 'ArrowUp') return onArrow(evt);
	return undefined;
};

export default compose(
	withApollo,
	withSearch,
	withHandlers({
		onSearch: (props) => (newSearchQuery) => {
			const {
				setSearchQuery,
				startLoading,
				searchQuery,
				allSearchResults,
			} = props;

			setSearchQuery(newSearchQuery);

			const prevQueryAlreadyGaveNoResults = searchQuery
				&& newSearchQuery.includes(searchQuery)
				&& allSearchResults.length === 0;
			if (prevQueryAlreadyGaveNoResults) return;

			startLoading();
			performQuery(props);
		},
		onKeyUp: getOnKeyUpHandler,
	}),
	lifecycle({
		componentDidMount() {
			document.addEventListener('keydown', this.props.onKeyUp);
		},
		componentWillUnmount() {
			document.removeEventListener('keydown', this.props.onKeyUp);
		},
	}),
)(Search);
