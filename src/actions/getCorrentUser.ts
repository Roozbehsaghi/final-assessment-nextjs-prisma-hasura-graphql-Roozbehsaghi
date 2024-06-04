"use server";

import prisma from "@/lib/prisma";

export const getCurrentUser = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return;

    const sitter = await prisma.sitterProfile.findUnique({
      where: {
        userId: user.id,
      },
    });

    return {
      sitter,
    };
  } catch (error) {
    console.log(error);
  }
};
