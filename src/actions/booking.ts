"use server";

import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { UsersDocument } from "@/lib/server-queries";

type CreateBookingProps = {
  sitterId: number | string;
  start: string;
  end: string;
  message: string;
};

export const createNewBooking = async ({
  sitterId,
  start,
  end,
  message,
}: CreateBookingProps) => {
  const id = Number(sitterId);

  const token = getToken();
  const client = createClient(token);
  const { data } = await client.query({ query: UsersDocument });

  const sitter = await prisma.sitterProfile.findUnique({
    where: {
      id: id,
    },
  });

  if (!data.users[0].id) return;

  if (sitter?.userId === data.users[0].id) return;

  try {
    const newBooking = await prisma.user.update({
      where: {
        id: data.users[0].id,
      },
      data: {
        bookings: {
          create: {
            start,
            end,
            description: message,
            bookeeId: id,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }

  return true;
};
