import LoginButton from "@/components/auth/login-btn";
import { Logo } from "@/components/branding/logo";
import { ShowSitters } from "@/components/show-sitters";
import { SitterButton } from "@/components/sitter-button";
import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import { UsersDocument } from "@/lib/server-queries";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = getToken();

  if (!token) {
    redirect("/api/auth/signin");
  }

  const client = createClient(token);

  const { data, error } = await client.query({ query: UsersDocument });

  if (error) {
    console.error(error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-yellow-200 after:via-pink-200 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-yellow-400 before:dark:opacity-10 after:dark:from-rose-900 after:dark:via-purple-700 after:dark:opacity-40">
        {data?.users && (
          <h1 className="text-5xl">
            <SparklesIcon className="inline h-12 w-12 animate-ping text-yellow-500" />
            Great, {data.users[0]?.name} is here!{" "}
            <SparklesIcon className="inline h-12 w-12 animate-ping text-yellow-500" />
          </h1>
        )}
      </div>
      <div className="max-w-sm">
        <SitterButton userId={data.users[0].id} />
      </div>
      <div className="flex items-center justify-center">
        <p className="color-muted-foreground">
          Check out our extraordinary sitters and books them according to your
          need
        </p>
      </div>
      <div className="mb-32 grid gap-y-3 text-center lg:mb-2 lg:w-full lg:max-w-5xl lg:grid-cols-5 lg:text-left">
        <ShowSitters token={token} userId={data.users[0].id} />
      </div>
    </main>
  );
}
