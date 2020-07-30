import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split, ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { persistCache } from 'apollo-cache-persist';
import { AUTH_TOKEN } from './constants';

import { defaults, resolvers } from './resolvers';

const cache = new InMemoryCache();

persistCache({
	cache,
	storage: window.localStorage,
});

const stateLink = withClientState({ resolvers, cache, defaults });

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem(AUTH_TOKEN);
	return {
		headers: {
			...headers,
			Authorization: token ? `Bearer ${token}` : null,
		},
	};
});

const httpLink = new HttpLink({
	uri: process.env.REACT_APP_GRAPHQL_QUERY_API,
});

const subscriptionLink = new WebSocketLink({
	uri: process.env.REACT_APP_GRAPHQL_SUBSCRIPTION_API,
	options: {
		reconnect: false,
	},
});

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	subscriptionLink,
	authLink.concat(httpLink),
);

const client = new ApolloClient({
	cache,
	link: ApolloLink.from([stateLink, link]),
});

export default client;
