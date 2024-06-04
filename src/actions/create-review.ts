"use server";

import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import { UsersDocument } from "@/lib/server-queries";

import prisma from "@/lib/prisma";

interface CreateReviewProps {
  revieweeId: number;
  reviewerId: number;
  rate: number;
  forWhom: "EMPLOYEE" | "SITTER";
  message?: string;
}

export const createReview = async ({
  revieweeId,
  reviewerId,
  forWhom,
  rate,
  message,
}: CreateReviewProps) => {
  const score = Number(rate);
  const reviewee = Number(revieweeId);
  const reviewer = Number(reviewerId);
  const token = getToken();
  const client = createClient(token);

  const { data } = await client.query({ query: UsersDocument });

  if (!data.users[0].id) return null;

  const newReview = await prisma.review.create({
    data: {
      score,
      message,
      for: forWhom,
      reviewer: {
        connect: {
          id: reviewer,
        },
      },
      reviewee: {
        connect: {
          id: reviewee,
        },
      },
    },
  });

  console.log("new review created", newReview);
};
