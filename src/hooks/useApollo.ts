"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useMemo, useState } from "react";

export const useApollo = (token?: string | null) => {
  const [jwt, setToken] = useState(token);

  const client = useMemo(() => {
    return new ApolloClient({
      uri: process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT,
      cache: new InMemoryCache(),
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : "",
      },
    });
  }, [jwt]);

  return { client, setToken };
};
