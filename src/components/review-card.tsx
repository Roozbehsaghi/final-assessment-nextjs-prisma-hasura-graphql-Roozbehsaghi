"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ReviewCardProps {
  rate: number;
  message: string;
  posted: string;
  isMine: boolean;
}

export const ReviewCard = ({
  rate,
  message,
  posted,
  isMine,
}: ReviewCardProps) => {
  //@ts-ignore
  const postedAt = format(posted, "Pp");
  return (
    <div
      className={cn(
        "flex flex-col gap-4 justify-between pb-4",
        isMine ? "bg-sky-200" : "bg-violet-300"
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-gray">Posted on: {postedAt}</span>
      </div>
      <div className="flex flex-col">
        <p>rated at {rate}</p>
        <p>{message}</p>
      </div>
      <Separator />
    </div>
  );
};
