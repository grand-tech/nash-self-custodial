import {ApolloClient, InMemoryCache} from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/allen-muhani/nashescrow',
  cache: new InMemoryCache(),
});
