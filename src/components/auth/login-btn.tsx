"use client";

import { useUsersQuery } from "@/lib/client-queries";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();
  const { data, error, loading } = useUsersQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (session) {
    return (
      <div className="flex flex-row gap-2 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200  lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30">
        Signed in as {session.user?.email}
        <button
          onClick={() => {
            signOut();
          }}
          className="text-red-500"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center justify-center rounded-md gap-2 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200  lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30">
      Not signed in
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
