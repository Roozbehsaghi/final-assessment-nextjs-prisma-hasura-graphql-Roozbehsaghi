import LoginButton from "@/components/auth/login-btn";
import { Logo } from "@/components/branding/logo";

export const Navbar = () => {
  return (
    <div className="z-10 w-full max-w-5xl mx-auto pt-2 items-center justify-between font-mono text-sm lg:flex">
      <div className="flex items-center justify-start gap-2 w-full">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200  lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30">
          <LoginButton />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none dark:from-black dark:via-black">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://kyna.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          By <Logo alt="Kyna Logo" width={121} height={24} />
        </a>
      </div>
    </div>
  );
};
