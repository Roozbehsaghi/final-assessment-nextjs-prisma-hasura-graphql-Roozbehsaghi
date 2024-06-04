import { createClient } from "@/lib/apollo";
import { SittersDocument } from "@/lib/server-queries";
import Link from "next/link";
import { SitterCard } from "./sitter-card";

interface ShowsittersProps {
  token?: string;
  userId?: number | string;
}

export const ShowSitters = async ({ token, userId }: ShowsittersProps) => {
  if (!token || !userId) return;
  const client = createClient(token);

  const { data, error } = await client.query({ query: SittersDocument });

  if (error) {
    console.log(error);
  }

  return (
    <div className="mb-2">
      {data.SitterProfile.map((sitter) => {
        if (sitter.userId === userId) return;
        return (
          <Link href={`/sitter-profile/${sitter.id}`} key={sitter.id}>
            <SitterCard
              name={sitter.name}
              city={sitter.city}
              hourlyRate={sitter.hourly_rate_euro}
            />
          </Link>
        );
      })}
    </div>
  );
};
