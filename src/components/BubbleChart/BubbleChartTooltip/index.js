import { onlyUpdateForKeys } from '@hypnosphi/recompose';
import BubbleChartTooltip from './BubbleChartTooltip';

export default onlyUpdateForKeys([
	'visible',
	'value',
])(BubbleChartTooltip);
