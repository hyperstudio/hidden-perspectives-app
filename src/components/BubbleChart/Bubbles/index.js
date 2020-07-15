import { onlyUpdateForKeys } from '@hypnosphi/recompose';
import Bubbles from './Bubbles';

export default onlyUpdateForKeys([
	'bubbleLayoutItems',
	'hoveredElement',
	'images',
	'activeElementId',
])(Bubbles);
