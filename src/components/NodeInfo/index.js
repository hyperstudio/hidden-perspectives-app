import {
	mapProps,
	withState,
	compose,
	onlyUpdateForKeys,
	lifecycle,
} from '@hypnosphi/recompose';
import { prop } from 'ramda';
import { getWikipediaImagePerUrl } from '../../utils/imageUtil';
import NodeInfo from './NodeInfo';

const getStakeholderImage = ({ title, id, setImage }) => {
	getWikipediaImagePerUrl(title, id, 200).then(setImage);
};

export default compose(
	mapProps(prop('item')),
	withState('descriptionExpanded', 'toggleDescriptionExpansion', false),
	withState('image', 'setImage', undefined),
	lifecycle({
		componentDidMount() {
			if (this.props.itemType === 'stakeholder'
				|| this.props.itemType === 'location') return getStakeholderImage(this.props);
			return undefined;
		},
		componentDidUpdate(prevProps) {
			if (this.props.id !== prevProps.id
				&& (this.props.itemType === 'stakeholder'
				|| this.props.itemType === 'location')) return getStakeholderImage(this.props);
			return undefined;
		},
	}),
	onlyUpdateForKeys([
		'item',
		'image',
		'descriptionExpanded',
		'authors',
	]),
)(NodeInfo);
