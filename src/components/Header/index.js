import { withProps, compose } from '@hypnosphi/recompose';
import Header from './Header';
import { isAuthenticated, isAuthorized } from '../../utils/localStorageUtil';
import { BrowserDetect, isMobile } from '../../utils/browserDetectionUtil';

export default compose(
	withProps(() => ({
		isAuthenticated,
		isAuthorized,
		browserIsNotSupported: BrowserDetect.browser !== 'Chrome' || isMobile.any(),
	})),
)(Header);
