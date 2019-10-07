import React from 'react';
import PropTypes from 'prop-types';
import {
	Container,
	AppTitle,
	Title,
	ButtonContainer,
} from './styles';
import ChromeLogo from './chrome-logo.svg';
import Button from '../../components/_library/Button';

const googleChromeDownloadUrl = 'https://www.google.com/chrome/';
const hiddenPerspectivesMicrositeUrl = '#';

const UnsupportedBrowser = () => (
	<Container>
		<AppTitle variant="h2">US-Iran Relations</AppTitle>
		<Title variant="h1">Unfortunately, this beta app was only developed and optimized for Google Chrome on desktop.</Title>
		<img src={ChromeLogo} alt="The Google Chrome app logo" />
		<ButtonContainer>
			<a href={googleChromeDownloadUrl} title="The official page of Google Chrome">
				<Button primary>Download Google Chrome</Button>
			</a>
		</ButtonContainer>
		<a href={hiddenPerspectivesMicrositeUrl} title="The hompage of US-Iran Relations">
			<Button>What is US-Iran Relations?</Button>
		</a>
	</Container>
);

UnsupportedBrowser.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string,
		}).isRequired,
	}).isRequired,
};

export default UnsupportedBrowser;
