"use server";

import prisma from "@/lib/prisma";

export const getSitterInfo = async (id: number) => {
  try {
    const sitter = await prisma.sitterProfile.findUnique({
      where: {
        id,
      },
    });

    if (!sitter) return;

    const user = await prisma.user.findUnique({
      where: {
        id: sitter.userId,
      },
    });
    const userImage = user?.image;
    return {
      ...sitter,
      userImage,
    };
  } catch (error) {
    console.log(error);
  }
};
