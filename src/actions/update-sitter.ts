"use server";

import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { UsersDocument } from "@/lib/server-queries";

type UpdateSitterProfileProps = {
  city: string;
  hourlyRate: string;
};

export const updateSitterProfile = async ({
  city,
  hourlyRate,
}: UpdateSitterProfileProps) => {
  if (!city || !hourlyRate) {
    return null;
  }

  const token = getToken();
  const client = createClient(token);
  const { data } = await client.query({ query: UsersDocument });

  if (!data.users[0].id) return;

  const updatedSitter = await prisma.user.update({
    where: {
      id: data.users[0].id,
    },
    data: {
      sitterProfile: {
        update: {
          hourlyRate,
          city,
        },
      },
    },
  });

  return true;
};
