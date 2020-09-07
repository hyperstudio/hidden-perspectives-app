import React from 'react';
import {
	Container,
	AppTitle,
	Title,
} from '../unsupportedBrowser/styles';
import Button from '../../components/_library/Button';

const NotFound = () => (
	<Container>
		<AppTitle variant="h2">US-Iran Relations</AppTitle>
		<Title variant="h1">404 Not Found</Title>
		<a href="/" title="Main timeline">
			<Button>Return to timeline</Button>
		</a>
	</Container>
);

export default NotFound;
