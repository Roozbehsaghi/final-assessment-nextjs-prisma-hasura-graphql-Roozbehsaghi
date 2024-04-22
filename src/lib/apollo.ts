import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createClient = (token?: string | null) => {
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;

  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT,
    cache: new InMemoryCache(),
    headers,
  });
};
