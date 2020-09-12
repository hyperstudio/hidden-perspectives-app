import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Head from '../Head';
import Theme from '../Theme';
import HistoryBreadcrumb from '../HistoryBreadcrumb';
import Home from '../../pages/home';
import Login from '../../pages/login';
import AdminPage from '../../pages/admin';
import CreatePage from '../../pages/create';
import DocumentPage from '../../pages/document';
import DocumentMetadataPage from '../../pages/documentMetadata';
import DocumentMetadataEditPage from '../../pages/documentMetadataEdit';
import EventPage from '../../pages/event';
import EventMetadataPage from '../../pages/eventMetadata';
import EventMetadataEditPage from '../../pages/eventMetadataEdit';
import ProtagonistPage from '../../pages/protagonist';
import ProtagonistMetadataPage from '../../pages/protagonistMetadata';
import ProtagonistMetadataEditPage from '../../pages/protagonistMetadataEdit';
import LocationPage from '../../pages/location';
import LocationMetadataPage from '../../pages/locationMetadata';
import LocationMetadataEditPage from '../../pages/locationMetadataEdit';
import TranscriptPage from '../../pages/transcript';
import OriginalPage from '../../pages/original';
import SearchPage from '../../pages/search';
import UnsupportedBrowser from '../../pages/unsupportedBrowser';
import NotFound from '../../pages/notFound';
import { GlobalStyles } from './styles';

const App = () => (
	<Router>
		<Theme>
			<>
				<Head />
				<GlobalStyles />
				<HistoryBreadcrumb />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/admin" component={AdminPage} />
					<Route exact path="/document/new" render={(props) => (<CreatePage {...props} itemType="document" />)} />
					<Route exact path="/document/context/:id" component={DocumentPage} />
					<Route exact path="/document/transcript/:id" component={TranscriptPage} />
					<Route exact path="/document/original/:id" component={OriginalPage} />
					<Route exact path="/document/metadata/:id" component={DocumentMetadataPage} />
					<Route exact path="/document/metadata/:id/edit" component={DocumentMetadataEditPage} />
					<Route exact path="/event/new" render={(props) => (<CreatePage {...props} itemType="event" />)} />
					<Route exact path="/event/context/:id" component={EventPage} />
					<Route exact path="/event/metadata/:id" component={EventMetadataPage} />
					<Route exact path="/event/metadata/:id/edit" component={EventMetadataEditPage} />
					<Route exact path="/protagonist/new" render={(props) => (<CreatePage {...props} itemType="stakeholder" />)} />
					<Route exact path="/protagonist/context/:id" component={ProtagonistPage} />
					<Route exact path="/protagonist/metadata/:id" component={ProtagonistMetadataPage} />
					<Route exact path="/protagonist/metadata/:id/edit" component={ProtagonistMetadataEditPage} />
					<Route exact path="/location/context/:id" component={LocationPage} />
					<Route exact path="/location/metadata/:id" component={LocationMetadataPage} />
					<Route exact path="/location/metadata/:id/edit" component={LocationMetadataEditPage} />
					<Route exact path="/search/:query" component={SearchPage} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/unsupported-browser" component={UnsupportedBrowser} />
					<Route component={NotFound} />
				</Switch>
			</>
		</Theme>
	</Router>
);

export default App;
