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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateSitterProfile } from "@/actions/update-sitter";

interface IProps {
  city: string;
  hourlyRate: string | number;
}

export const UpdateSitterProfile = ({ city, hourlyRate }: IProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const updateSitter = async (data: FieldValues) => {
    const { city, hourlyRate } = data;

    const res = await updateSitterProfile({ city, hourlyRate });

    if (!res) return;

    console.log(res);
    reset();
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Update my profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your profile</DialogTitle>
          <DialogDescription>
            FPlease note only city and hourly rate can be updated
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit(updateSitter)}>
          <div className="grid grid-col-4 items-center gap-4">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city", {
                required: "Please enter the city you live in",
              })}
              defaultValue={city}
            />
          </div>
          <div className="grid grid-col-4 itens-center gap-4">
            <Label htmlFor="hourlyRate">Your hourly rate</Label>
            <Input
              id="hourlyRate"
              defaultValue={formatPrice(hourlyRate)}
              {...register("hourlyRate", {
                required: "Please enter your expected hourly rate",
              })}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
