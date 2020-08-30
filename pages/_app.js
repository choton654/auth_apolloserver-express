import { ApolloProvider } from '@apollo/client';
import Layout from '../components/Layout';
import { useApollo } from '../graphql/apolloClient';

export default function MyApp({ Component, pageProps, token }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
