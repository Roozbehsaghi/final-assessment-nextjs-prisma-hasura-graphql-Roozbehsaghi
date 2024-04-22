"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/hooks/useApollo";
import { useEffect } from "react";

type Props = {
  session: Session | null;
  token: string | null;
  children: React.ReactNode;
};

export default function Providers({ session, token, children }: Props) {
  const { client, setToken } = useApollo(token);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [setToken, token]);

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  );
}
