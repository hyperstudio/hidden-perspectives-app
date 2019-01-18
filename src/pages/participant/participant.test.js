import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Client from '../../state';
import ParticipantPage from '.';

const match = {
	params: { id: 'bob' },
};

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Router><Client><ParticipantPage match={match} /></Client></Router>, div);
	ReactDOM.unmountComponentAtNode(div);
});

