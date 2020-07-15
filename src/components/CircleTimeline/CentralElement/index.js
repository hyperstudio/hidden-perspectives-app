import {
	onlyUpdateForKeys,
	withState,
	compose,
	lifecycle,
	withProps,
} from '@hypnosphi/recompose';
import { getWikipediaImage } from '../../../utils/imageUtil';
import CentralElement from './CentralElement';
import { formatHumanDateShort } from '../../../utils/dateUtil';

const getStakeholderImage = ({ title, id, setImage }) => {
	getWikipediaImage(title, id, 80).then(setImage);
};

export default compose(
	withState('image', 'setImage', undefined),
	withProps(({ date }) => ({
		formattedDate: formatHumanDateShort(date),
	})),
	lifecycle({
		componentDidMount() {
			if (this.props.itemType === 'stakeholder'
				|| this.props.itemType === 'location') {
				getStakeholderImage(this.props);
			}
		},
		componentDidUpdate(prevProps) {
			if (this.props.id !== prevProps.id) {
				this.props.setImage(undefined);
				if (this.props.itemType === 'stakeholder'
					|| this.props.itemType === 'location') {
					getStakeholderImage(this.props);
				}
			}
		},
	}),
	onlyUpdateForKeys([
		'itemType',
		'id',
		'date',
		'original',
		'image',
	]),
)(CentralElement);
