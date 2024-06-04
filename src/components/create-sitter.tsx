"use client";

import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createNewSitter } from "@/actions/create-sitter";

export const CreateSitter = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createSitter = async (data: FieldValues) => {
    const { name, city, hourlyRate } = data;

    const res = await createNewSitter({ name, city, hourlyRate });

    if (!res) return;

    console.log(res);
    reset();
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Want to become a sitter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your profile</DialogTitle>
          <DialogDescription>
            Fill the form and become a sitter, Please note only city and hourly
            rate can be updated later
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit(createSitter)}>
          <div className="grid grid-col-4 items-center gap-4">
            <Label htmlFor="name">Your full Name</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Please enter your full name",
              })}
            />
          </div>
          <div className="grid grid-col-4 items-center gap-4">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city", {
                required: "Please enter the city you live in",
              })}
            />
          </div>
          <div className="grid grid-col-4 itens-center gap-4">
            <Label htmlFor="hourlyRate">Your hourly rate</Label>
            <Input
              id="hourlyRate"
              defaultValue={formatPrice(0)}
              {...register("hourlyRate", {
                required: "Please enter your expected hourly rate",
              })}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create your profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
