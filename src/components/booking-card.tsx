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
  startingDate: number | Date;
  endingDate: number | Date;
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
    <tbody>
      <tr className={cn(status ? "bg-rose-600 text-white" : "bg-slate-100")}>
        {sitter && (
          <td>
            <p className="text-center">{sitter}</p>
          </td>
        )}
        {user && (
          <td>
            <p className="text-center">{user}</p>
          </td>
        )}
        <td>
          <p className="text-center">{format(startingDate, "Pp")}</p>
        </td>
        <td>
          <p className="text-center">{format(endingDate, "Pp")}</p>
        </td>
        <td>
          <p className="text-center">{desc}</p>
        </td>
        <td>
          {status ? (
            <p className="text-center">this booking is canceled</p>
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
              title="Rate and Review"
            />
          )}
        </td>
      </tr>
    </tbody>
  );
};
