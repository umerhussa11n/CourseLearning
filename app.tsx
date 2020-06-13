import * as React from "react";
import {get} from "lodash";

import ApolloClient from 'apollo-client';
import {defaultDataIdFromObject, InMemoryCache} from 'apollo-cache-inmemory';
import {CachePersistor} from 'apollo-cache-persist'
import {createHttpLink} from 'apollo-link-http';
import {ApolloProvider, useQuery} from '@apollo/react-hooks';

import {setContext} from "apollo-link-context";
import {CURRENT_USER_PROFILE, GET_ME} from "./graphql/queries";
import LoadingContainer from "./components/hoc/LoadingContainer/LoadingContainer";
import Routes from "./Routes";
import { onError } from 'apollo-link-error';
import { from } from 'apollo-link';


const httpLink = createHttpLink({
  uri:  "/graphql"
});

const token = localStorage.getItem('token');
const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const middlewareLink = onError(({networkError, graphQLErrors, operation, forward}) => {
  const { response } = operation.getContext();
  if (response.status === 401) {
    localStorage.removeItem('token');
    (async () => {
      ElentaClient.stop();
      await ElentaClient.clearStore();
      await ElentaCachePersistor.purge()
    })();
    window.location.replace('/');
  }
});

const cache = new InMemoryCache({
  dataIdFromObject: (obj) => {
    switch (obj.__typename) {
      case 'Module': {
        const pivotId = get(obj, 'pivot.id', null);
        const moduleDataId = `${obj.__typename}:${obj.id}`;
        return pivotId ? `${moduleDataId}:${pivotId}` : moduleDataId;
      }

      default:
        return defaultDataIdFromObject(obj);
    }
  }
});

export const ElentaCachePersistor = new CachePersistor({
  cache,
  storage: window.localStorage,
});

export const ElentaClient = new ApolloClient({
  link: from([middlewareLink, authLink, httpLink]),
  cache,
  resolvers: {},
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    }
  },
});

export const App = () => {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (token) {
      (async () => {
        const {data} = await ElentaClient.query({query: GET_ME});
        const {data: userProfileData} = await ElentaClient.query({query: CURRENT_USER_PROFILE});

        if (!userProfileData || !userProfileData.userProfile) {
          const consultantProfile = get(data, 'me.consultantProfile', null);
          const learnerProfile = get(data, 'me.learnerProfile', null);

          const user = get(data, 'me', null);
          const userProfile = consultantProfile
            ? {...consultantProfile, type: "consultantProfile"}
            : {...learnerProfile, type: "learnerProfile"};

          ElentaClient.writeData({
            data: {
              user,
              userProfile,
            }
          });
        }

        setLoading(false);
      })();
    } else {
      ElentaClient.writeData({
        data: {
          user: null,
          userProfile: null,
        }
      });
      setLoading(!loading);
    }
  }, [token]);

  return (
    <ApolloProvider client={ElentaClient}>
      {loading
        ? <LoadingContainer loading={loading}/>
        : <Routes/>
      }
    </ApolloProvider>
  );
};

export default App;
