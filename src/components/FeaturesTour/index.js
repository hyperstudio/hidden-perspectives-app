import { compose, withProps } from '@hypnosphi/recompose';
import { withTheme } from 'styled-components';
import { withRouter } from 'react-router-dom';

import DocumentImage from './images/documents.svg';
import EventImage from './images/events.svg';
import ProtagonistImage from './images/protagonists.svg';
import MinimapImage from './images/minimap.gif';
import PinningImage from './images/hovering-and-pinning.gif';
import SearchImage from './images/search.gif';

import CentralElementImage from './images/central-element.svg';
import EntryInfoImage from './images/entry-information.svg';
import EntryInTimeImage from './images/entry-in-time.svg';
import RelatedEntriesImage from './images/related-entries.svg';

import FeaturesTour from './FeaturesTour';

const steps = {
	mainTimeline: [
		{
			title: 'Welcome!',
			content: 'US-Iran Relations is an interactive digital archive consisting of documents and events relating to the U.S.-Iran relationship’s history since the 1978 – 1979 Iranian revolution.',
		},
		{
			title: 'Documents',
			image: DocumentImage,
			selector: '.timeline-event[data-id="uir003004"]',
			content: 'Documents are symbolized by a page icon and are placed on the left of the vertical timeline.',
		},
		{
			title: 'Events',
			image: EventImage,
			selector: '.timeline-event[data-id="3-12"]',
			content: 'Event are symbolized by a calendar icon and are placed on the right of the vertical timeline.',
		},
		{
			title: 'Protagonists',
			image: ProtagonistImage,
			selector: '.tour-protagonists',
			content: 'These are the protagonists involved in the visible documents and events.',
		},
		{
			title: 'Minimap',
			image: MinimapImage,
			selector: '.tour-minimap',
			content: 'The minimap allows you to quickly jump into a specific year and to get a sense of the content\'s density of each year.',
		},
		{
			title: 'Hovering',
			image: PinningImage,
			selector: '.protagonist-8cca25bd0a19999a594d',
			content: 'Hovering on an element highlights related elements.',
		},
		{
			title: 'Searching',
			image: SearchImage,
			selector: '.tour-search',
			content: 'You can search for specific contents using the search field.',
		},
	],
	circleTimeline: [
		{
			title: 'Current entry',
			image: CentralElementImage,
			selector: '.tour-central-element',
			content: 'The central element of this visualisation represents the entry you just clicked.',
		},
		{
			title: 'Entry information',
			image: EntryInfoImage,
			selector: '.tour-entry-information',
			content: 'More information about the current entry can be read here.',
		},
		{
			title: 'The entry in its context',
			image: EntryInTimeImage,
			selector: '.tour-entry-on-timeline',
			content: 'The current entry is also represented in blue on the timeline.',
		},
		{
			title: 'Related entries',
			selector: '.tour-related-entries',
			content: 'The current entry is surrounded by related entries (documents and events sharing one identical keyword) displayed in a circular timeline (to be read clockwise).',
		},
		{
			title: 'Entry keywords',
			image: RelatedEntriesImage,
			selector: '.tour-entry-keywords',
			content: 'These are the current entry\'s keywords. Hover on them or enable/disable them to see which entries share the same keywords.',
		},
		{
			title: 'Related entries list',
			selector: '.tour-related-entries-list',
			content: 'Related entries are also displayed in a list for you to explore. Hovering on any entry will highlight other entries that also relate to it.',
		},
		{
			title: 'Menu tabs',
			selector: '.tour-menu-tabs',
			content: 'Detailled information about the entry can be found in those other tabs.',
		},
		{
			title: 'Go back',
			selector: '.tour-back-to-timeline',
			content: 'Click on this icon to navigate back to the vertical timeline.',
		},
	],
};

export default compose(
	withTheme,
	withRouter,
	withProps(({ theme, page }) => ({
		accentColor: theme.primary,
		borderColor: theme.gray200,
		steps: steps[page] || [],
	})),
)(FeaturesTour);
