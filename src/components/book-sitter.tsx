"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, useForm, Controller } from "react-hook-form";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
// import Calendar from "./calendar";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createNewBooking } from "@/actions/booking";

export const BookingSitter = ({ sitterId }: { sitterId: number }) => {
  const id = Number(sitterId);
  const router = useRouter();
  //   const [dateRange, setDateRange] = useState([null, null]);
  //   const [startDate, endDate] = dateRange;
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleBooking = async (data: FieldValues) => {
    const { sitterId, startDate, endDate, message } = data;
    const start = formatISO(startDate);
    const end = formatISO(endDate);

    const res = await createNewBooking({
      sitterId,
      start,
      end,
      message,
    });

    if (!res) return;

    console.log(res);
    reset();
    router.refresh();
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full h-full">
            Book this sitter
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book sitter</DialogTitle>
            <DialogDescription>
              You can book this sitter. Please consider available dates and make
              sure they match your needs.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4 py-4"
            onSubmit={handleSubmit(handleBooking)}
          >
            <input
              type="number"
              defaultValue={id}
              className="hidden"
              {...register("sitterId")}
            />
            <div className="grid grid-col-4 items-center gap-4">
              <label>Start Date</label>
              <input type="datetime-local" {...register("startDate")} />
              <label>End Date</label>
              <input type="datetime-local" {...register("endDate")} />
            </div>
            <div className="grid grid-col-4 itens-center gap-4">
              <Textarea
                placeholder="Add your description here"
                {...register("message", {
                  required: "Please add description",
                })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Finalize your booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
