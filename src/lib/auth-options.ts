import argon2 from "argon2";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { cookies } from "next/headers";
import * as jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { HasuraAdapter } from "next-auth-hasura-adapter";

export const authOptions: AuthOptions = {
  adapter: HasuraAdapter({
    endpoint: process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT!,
    adminSecret: process.env.HASURA_ADMIN_SECRET!,
  }),
  theme: {
    colorScheme: "auto",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@domain.com" },
        password: {
          label: "Passphrase",
          type: "password",
          placeholder: "enter some passphrase",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (user?.password && (await argon2.verify(user.password, password))) {
          return user;
        }

        return null;
      },
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(token!, secret, {
        algorithm: "HS256",
      });
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret, {
        algorithms: ["HS256"],
      });
      return decodedToken as JWT;
    },
  },
  callbacks: {
    // Add the required Hasura claims
    // https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/#the-spec
    async jwt({ token }) {
      return {
        ...token,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-role": "user",
          "x-hasura-user-id": token.sub,
        },
      };
    },
    // Add user ID to the session
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};

export const getAuth = () => getServerSession(authOptions);

export const getToken = () => {
  const allCookies = cookies();
  const cookieName = "next-auth.session-token";
  const token = allCookies.get(cookieName)?.value || null;
  return token;
};
