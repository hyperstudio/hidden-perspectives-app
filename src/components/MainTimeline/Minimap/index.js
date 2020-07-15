import { onlyUpdateForKeys } from '@hypnosphi/recompose';
import Minimap from './Minimap';

export default onlyUpdateForKeys(['activeYear', 'isLoading', 'items'])(Minimap);
