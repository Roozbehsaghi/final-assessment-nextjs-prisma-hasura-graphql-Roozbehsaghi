import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/actions/getCorrentUser";
import { CreateSitter } from "./create-sitter";

interface SitterButtonProps {
  userId: number;
}

export const SitterButton = async ({ userId }: SitterButtonProps) => {
  const currentUser = await getCurrentUser(userId);

  if (!currentUser?.sitter?.id) return <CreateSitter />;

  return (
    <Link href={`/sitter-profile/${currentUser.sitter.id}`}>
      <Button variant="outline">check and update your profile</Button>
    </Link>
  );
};
