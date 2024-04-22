"use client";

import { useUsersQuery } from "@/lib/client-queries";
import { useSession, signIn, signOut } from "next-auth/react";
export default function LoginButton() {
  const { data: session } = useSession();
  const { data, error, loading } = useUsersQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("data", data);

  if (session) {
    return (
      <div className="flex flex-row gap-2">
        Signed in as {session.user?.email}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className="flex flex-row gap-2">
      Not signed in
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
