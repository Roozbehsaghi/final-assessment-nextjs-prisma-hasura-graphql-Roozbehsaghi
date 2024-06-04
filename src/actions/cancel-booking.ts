"use server";

import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { UsersDocument } from "@/lib/server-queries";

type CancelBookingProps = {
  isCanceled: string;
  bookingId: string | number;
};

export const cancelBooking = async ({
  isCanceled,
  bookingId,
}: CancelBookingProps) => {
  const id = Number(bookingId);
  const isCancel = isCanceled === "true" ? true : false;
  const booking = await prisma.booking.findUnique({
    where: {
      id: id,
    },
  });

  if (!booking || booking.isCancel === true) return;

  const sitter = await prisma.sitterProfile.findUnique({
    where: {
      id: booking.bookeeId,
    },
  });

  const token = getToken();
  const client = createClient(token);
  const { data } = await client.query({ query: UsersDocument });

  if (
    data.users[0].id !== booking.bookerId &&
    data.users[0].id !== sitter?.userId
  )
    return null;

  const canceledBooking = await prisma.booking.update({
    where: {
      id: id,
    },
    data: {
      isCancel: isCancel,
    },
  });

  return canceledBooking;
};
