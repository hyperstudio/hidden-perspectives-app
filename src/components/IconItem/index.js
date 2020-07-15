import { withTheme } from 'styled-components';
import { compose, onlyUpdateForKeys } from '@hypnosphi/recompose';
import IconItem from './IconItem';

export default compose(
	withTheme,
	onlyUpdateForKeys([
		'itemType',
		'isCurrent',
		'hovered',
	]),
)(IconItem);
