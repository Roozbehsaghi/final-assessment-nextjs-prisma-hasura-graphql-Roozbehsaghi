"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createReview } from "@/actions/create-review";

interface ReviewFormProps {
  reviewerId: number;
  revieweeId: number;
  forwhom: "SITTER" | "EMPLOYEE";
  title: string;
}

export const ReviewForm = ({
  reviewerId,
  revieweeId,
  forwhom,
  title,
}: ReviewFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const createNewReview = async (data: FieldValues) => {
    const { revieweeId, reviewerId, forWhom, rate, message } = data;

    const res = await createReview({
      revieweeId,
      reviewerId,
      forWhom,
      rate,
      message,
    });

    if (!res) return;

    reset();
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-full">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate and Review</DialogTitle>
          <DialogDescription>
            Rate and Review your exprience, click save when your done
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 py-4"
          onSubmit={handleSubmit(createNewReview)}
        >
          <div className="grid grid-col-4 items-center gap-4">
            <input
              type="hidden"
              className="hidden"
              {...register("reviewerId")}
              defaultValue={reviewerId}
            />
            <input
              type="hidden"
              className="hidden"
              {...register("revieweeId")}
              defaultValue={revieweeId}
            />
            <input
              type="hidden"
              className="hidden"
              {...register("forWhom")}
              defaultValue={forwhom}
            />
          </div>
          <div className="grid grid-col-4 items-center gap-4">
            <input
              type="number"
              {...register("rate", {
                required: "input a number",
              })}
              placeholder="chose a number between 1 to 5"
            />
          </div>
          <div className="grid grid-col-4 itens-center gap-4">
            <Textarea
              placeholder="Write your review here &lpar;Optional&rpar;"
              {...register("message")}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Submit your rate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
