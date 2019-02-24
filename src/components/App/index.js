import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Head from '../Head';
import Theme from '../Theme';
import Home from '../../pages/home';
import Login from '../../pages/login';
import DocumentPage from '../../pages/document';
import DocumentMetadataPage from '../../pages/documentMetadata';
import EventPage from '../../pages/event';
import EventMetadataPage from '../../pages/eventMetadata';
import ProtagonistPage from '../../pages/protagonist';
import ProtagonistMetadataPage from '../../pages/protagonistMetadata';
import LocationPage from '../../pages/location';
import LocationMetadataPage from '../../pages/locationMetadata';
import TranscriptPage from '../../pages/transcript';
import OriginalPage from '../../pages/original';
import UnsupportedBrowser from '../../pages/unsupportedBrowser';
import { GlobalStyles } from './styles';

const App = () => (
	<Router>
		<Theme>
			<>
				<Head />
				<GlobalStyles />
				<Route exact path="/" component={Home} />
				<Route exact path="/document/context/:id" component={DocumentPage} />
				<Route exact path="/document/transcript/:id" component={TranscriptPage} />
				<Route exact path="/document/original/:id" component={OriginalPage} />
				<Route exact path="/document/metadata/:id" component={DocumentMetadataPage} />
				<Route exact path="/document/metadata/:id/edit" component={() => null} />
				<Route exact path="/event/context/:id" component={EventPage} />
				<Route exact path="/event/metadata/:id" component={EventMetadataPage} />
				<Route exact path="/event/metadata/:id/edit" component={() => null} />
				<Route exact path="/protagonist/context/:id" component={ProtagonistPage} />
				<Route exact path="/protagonist/metadata/:id" component={ProtagonistMetadataPage} />
				<Route exact path="/location/context/:id" component={LocationPage} />
				<Route exact path="/location/metadata/:id" component={LocationMetadataPage} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/unsupported-browser" component={UnsupportedBrowser} />
			</>
		</Theme>
	</Router>
);

export default App;
