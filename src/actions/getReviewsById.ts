"use server";

import prisma from "@/lib/prisma";

export const getReviewsById = async (id: number) => {
  const recievedReviews = await prisma.review.findMany({
    where: {
      revieweeId: id,
    },
  });

  const writtenReviews = await prisma.review.findMany({
    where: {
      reviewerId: id,
    },
  });

  return {
    recievedReviews,
    writtenReviews,
  };
};
