import { compose, lifecycle, withHandlers } from '@hypnosphi/recompose';
import { withApollo } from 'react-apollo';
import { getSearchQuery, handleSearchResults, withSearch } from '../Search/utils';
import SearchView from './SearchView';
import { getErrorHandler } from '../../utils/hocUtil';

const performQuery = (props) => {
	props.client.query({
		query: getSearchQuery(),
		variables: { searchQuery: props.query },
	})
		.then(handleSearchResults(props, props.query))
		.catch(getErrorHandler(props, props.query));
};

const getOnKeyUpHandler = ({
	onTab,
	onArrow,
	onEnter,
	onEscape,
}) => function onKeyUp(evt) {
	const searhFiledWithFocus = document.querySelector('#search-bar:focus');
	if (searhFiledWithFocus && searhFiledWithFocus.value) return undefined;
	if (evt.code === 'Tab') return onTab(evt);
	if (evt.code === 'Enter') return onEnter(evt);
	if (evt.code === 'Escape') return onEscape(evt);
	if (evt.code === 'ArrowDown' || evt.code === 'ArrowUp') return onArrow(evt);
	return undefined;
};

export default compose(
	withApollo,
	withSearch,
	withHandlers({
		onKeyUp: getOnKeyUpHandler,
	}),
	lifecycle({
		componentDidMount() {
			performQuery(this.props);
			document.addEventListener('keydown', this.props.onKeyUp);
		},
		componentWillUnmount() {
			document.removeEventListener('keydown', this.props.onKeyUp);
		},
		componentDidUpdate(prevProps) {
			if (!this.props.query) return;
			if (prevProps.query === this.props.query) return;
			performQuery(this.props);
		},
	}),
)(SearchView);
