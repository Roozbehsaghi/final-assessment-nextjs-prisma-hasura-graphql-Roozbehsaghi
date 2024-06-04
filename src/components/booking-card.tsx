"use client";

import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { format, isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ReviewForm } from "./review-for";
import { useForm, FieldValues } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cancelBooking } from "@/actions/cancel-booking";

interface BookingCardProps {
  bookingId: number;
  sitter?: string | null;
  user?: string | null;
  startingDate: string;
  endingDate: string;
  status: boolean;
  desc: string;
  reviewer: number;
  reviewee: number;
  forWhom: "SITTER" | "EMPLOYEE";
}

export const BookingCard = ({
  bookingId,
  sitter,
  user,
  startingDate,
  endingDate,
  status,
  desc,
  reviewer,
  reviewee,
  forWhom,
}: BookingCardProps) => {
  //@ts-ignore
  const startDate = format(startingDate, "Pp");
  //@ts-ignore
  const endDate = format(endingDate, "Pp");
  const router = useRouter();
  //@ts-ignore
  const compare = isFuture(endingDate);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const handleCancel = async (data: FieldValues) => {
    const { isCanceled, bookingId } = data;

    if (isCanceled !== "true") return;

    const res = await cancelBooking({ bookingId, isCanceled });

    if (!res) return;

    console.log(res);
    reset();
    router.refresh();
  };
  return (
    <div
      className={cn(
        "flex items-center w-full gap-2 p-3",
        status ? "bg-rose-600" : "bg-slate-100"
      )}
    >
      <div className="flex w-full justify-between items-center gap-2">
        {sitter && (
          <div className="flex flex-col gap-2">
            <p className="text-center">Sitter Name</p>
            <Separator />
            <p className="text-center">{sitter}</p>
          </div>
        )}
        {user && (
          <div className="flex flex-col gap-2">
            <p className="text-center">Booker Name</p>
            <Separator />
            <p className="text-center">{user}</p>
          </div>
        )}
        <Separator orientation="vertical" />
        <div className="flex flex-auto flex-col gap-2">
          <p className="text-center">Starting Date</p>
          <Separator />
          <p className="text-center">{startDate}</p>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-auto flex-col gap-2">
          <p className="text-center">Ending Date</p>
          <Separator />
          <p className="text-center">{endDate}</p>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-auto flex-col gap-2">
          <p className="text-center">Description</p>
          <Separator />
          <p className="text-center">{desc}</p>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-2">
          <p className="text-center">actions</p>
          <Separator />
          {status ? (
            <p>this booking is canceled</p>
          ) : compare ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Cancel this booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>cancel your booking</DialogTitle>
                  <DialogDescription>
                    Are you sure? this action can not be undone
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="grid gap-4 py-4"
                  onSubmit={handleSubmit(handleCancel)}
                >
                  <div className="grid grid-col-4 items-center gap-4">
                    <Input
                      className="hidden"
                      {...register("bookingId")}
                      defaultValue={bookingId}
                      hidden
                    />
                  </div>
                  <div className="grid grid-col-4 itens-center gap-4">
                    <Label htmlFor="isCanceled">type true to proceed</Label>
                    <Input
                      id="isCanceled"
                      {...register("isCanceled", {
                        required: "Please type true to proceed",
                      })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Cancel booking</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <ReviewForm
              revieweeId={reviewee}
              reviewerId={reviewer}
              forwhom={forWhom}
            />
          )}
        </div>
      </div>
    </div>
  );
};
