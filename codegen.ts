import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT ||
      "http://localhost:8080/v1/graphql"]: {
        headers: {
          ["x-hasura-admin-secret"]: process.env.HASURA_ADMIN_SECRET || "",
        },
      },
    },
  ],
  documents: ["./src/_queries/**/*.graphql"],
  generates: {
    "./src/lib/server-queries.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
    "./src/lib/client-queries.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
  config: {
    reactApolloVersion: 3,
    withHooks: true,
  },
};

export default config;
