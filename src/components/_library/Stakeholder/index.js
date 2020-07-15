import { compose, lifecycle, withState } from '@hypnosphi/recompose';
import Stakeholder from './Stakeholder';
import { getWikipediaImage } from '../../../utils/imageUtil';

export default compose(
	withState('image', 'setImage', undefined),
	lifecycle({
		componentDidMount() {
			const { setImage, children: name, id } = this.props;
			getWikipediaImage(name, id, 64).then(setImage);
		},
		componentDidUpdate(prevProps) {
			const { setImage, children: name, id } = this.props;
			if (prevProps.id === id) return;
			getWikipediaImage(name, id, 64).then(setImage);
		},
	}),
)(Stakeholder);
