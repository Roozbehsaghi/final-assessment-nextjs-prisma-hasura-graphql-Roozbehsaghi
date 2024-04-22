# NextJS + Prisma + Hasura

This is a template for a fullstack application using Next.js, Prisma, and Hasura.

## Features

- Next.js frontend
- Prisma ORM
- Hasura GraphQL API
- JWT authentication
- Role-based access control
- Code generation for TypeScript types and queries

## Getting Started

First, run Hasura via Docker Compose:

```bash
docker-compose up -d
```

Then, run the following command to generate the Prisma client:

```bash
npx prisma generate
```

Then, run the following command to migrate the database:

```bash
npx prisma db push
```

Then, run the following command to seed the database:

```bash
npx prisma db seed
```

Then, open the Hasura console:

[https://localhost:8080](https://localhost:8080)

Go to [`Data`](http://localhost:8080/console/data/manage) and click `Connect Database`.

![setup database connection](https://kyn.ac/SCR-20240329-fzr.png)

Then, make sure Postgres is selected, and click `Connect Existing Dabase`.

![connect existing database](https://kyn.ac/SCR-20240329-g0n.png)

Call it `default`, put in the Environment Variable `PG_DATABASE_URL` and click `Connect Database`.

![connect database](https://kyn.ac/SCR-20240329-g24.png)

Now, navigate to the database's [public schema](http://localhost:8080/console/data/default/schema/public), and click `Track All` to track all tables.

![track tables](https://kyn.ac/SCR-20240404-vbt.png)

And finally, track all relations as well:

![track relations](https://kyn.ac/SCR-20240404-vcw.png)

## User Permissions

Navigate to the `Permissions` tab on the `users` table, and add the following "Column Select" permissions for the `user` role:

- `user`:
  - `Select` permission on `user`:
    - `id`
    - `email`
    - `name`
    - `image`

Also, set up a custom check:

- Allow role `user` to select rows:
  - `With custom check`:
    - `id`:
      - `_eq`:
        - `X-Hasura-User-Id`

![user permissions](https://kyn.ac/SCR-20240404-vf3.png)

Save the permissions, and go to the API Explorer to test the permissions.

To do this, we need to obtain a JWT token from the Next.js app. So we need to prepare that first.

Copy `.env.example` to `.env`.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You will be redirected to the login page. You can login with the following credentials:

- Email: `alice@kyna.dev`
- Password: `password`

Or:

- Email: `bob@kyna.dev`
- Password: `password`

You can also register a new account.

Once you are logged in, you can get the JWT token by opening the console, navigate to the `Application` tab, and click `Cookies` storage on the left.

The JWT token is stored in the `next-auth.session-token` cookie. Copy the value of the cookie.

![auth cookie](https://kyn.ac/SCR-20240404-vll.png)

Now, go to the API Explorer in the Hasura console, and click `Headers` to add the following header:

- `Authorization`: `Bearer <JWT>`

Replace `<JWT>` with the value of the JWT token.

Also, make sure to add the `X-Hasura-Role` header with the value `user`.

If all is well, you should be able to query the `users` table, and see only the user's own data.

```graphql
query {
  users {
    id
    email
    name
    image
  }
}
```

![api explorer](https://kyn.ac/SCR-20240404-vmj.png)

Note: You can also test if Hasura is able to decode the JWT token by clicking the `Decode` button in the `Headers` tab.

![decode button](https://kyn.ac/SCR-20240404-vpd.png)

If all is well, you should see the decoded JWT. If not, you will see an error message. In that case, make sure the JWT secret is set up correctly in both the `.env` file (`NEXTAUTH_SECRET`) and in the `docker-compose.yml` file (`HASURA_GRAPHQL_JWT_SECRET`).

![decoded JWT](https://kyn.ac/SCR-20240404-vpr.png)

If you change the secret, you will need to restart Hasura:

```bash
$ docker-compose down hasura
$ docker-compose up -d hasura
```

## Code Generation

To generate TypeScript types and queries for the GraphQL queries, run the following command:

```bash
$ npm run generate
```

This will generate the types and queries in the `src/lib` folder.

To add a new query, add a new `.graphql` file in the `src/_queries` folder, and run the `generate` script again.

Example query:

```graphql
query Users {
  users {
    id
    name
    email
  }
}
```

This will generate the TypeScript types, and the following hooks:

```
useUsersQuery
useUsersLazyQuery
```

You can use these hooks in your components to fetch data from the GraphQL API.

```tsx
import { useUsersQuery } from "@/lib/client-queries";

export default function Users() {
  const { data, loading, error } = useUsersQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

On the server side, we can't use hooks, so we can use the `query` function directly:

```tsx
import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
// import from SERVER queries!
import { UsersDocument } from "@/lib/server-queries";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = getToken();

  if (!token) {
    redirect("/api/auth/signin");
  }

  const client = createClient(token);

  const { data, error } = await client.query({ query: UsersDocument });

  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Deploying to production

When deploying your site set the `NEXTAUTH_URL` environment variable to the canonical URL of the website.

```bash
NEXTAUTH_URL=https://example.com
```

Also, make sure to generate a new JWT secret. You can generate a new secret by running the following command:

```bash
$ openssl rand -base64 32
```

Assign it to the `NEXTAUTH_SECRET` environment variable in your deployment config.

```bash
NEXTAUTH_SECRET=your-new-secret
```

If you are deploying to Vercel, you can set the environment variables in the Vercel dashboard.

If you are deploying to another platform, make sure to set the environment variables in the deployment configuration.

### Deploying Hasura

To deploy Hasura, you can use the Hasura Cloud service, or deploy it to Render via the following button:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/TechmongersNL/hasura-workshop-deployment)

Make sure to set the `HASURA_GRAPHQL_JWT_SECRET` environment variable to the JWT secret you generated earlier.

![Hasura admin secret](https://kyn.ac/SCR-20240404-w9z.png)

Also, make sure to copy the generated `HASURA_GRAPHQL_ADMIN_SECRET` environment variable from the Render dashboard, and set it as `HASURA_ADMIN_SECRET` in the environment variables in the Next.js app. This is used to authenticate the code generation script during deployment.
