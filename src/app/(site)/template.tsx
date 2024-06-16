import { getToken } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getToken();

  if (!token) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="max-w-4xl flex flex-col items-center justify-center h-full mx-auto">
      {children}
    </div>
  );
}
