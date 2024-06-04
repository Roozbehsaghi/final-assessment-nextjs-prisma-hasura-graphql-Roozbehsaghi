"use server";

import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { UsersDocument } from "@/lib/server-queries";

type createSitterProps = {
  city: string;
  name: string;
  hourlyRate: string;
};

export const createNewSitter = async ({
  city,
  name,
  hourlyRate,
}: createSitterProps) => {
  if (!city || !name || !hourlyRate) {
    return null;
  }

  const token = getToken();
  const client = createClient(token);
  const { data } = await client.query({ query: UsersDocument });

  if (!data.users[0].id) return;

  const newSitter = await prisma.user.update({
    where: {
      id: data.users[0].id,
    },
    data: {
      sitterProfile: {
        create: {
          hourlyRate,
          city,
          name,
        },
      },
    },
  });

  return true;
};
