import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface SitterInfoProps {
  image?: string | null;
  name?: string;
  city?: string;
  hourlyRate: string;
  startedWorking: Date;
}

export const SitterInfo = ({
  image,
  name,
  city,
  hourlyRate,
  startedWorking,
}: SitterInfoProps) => {
  return (
    <div className="flex gap-6">
      <Image
        src={image || "/placeholder.jpg"}
        alt="Avatar"
        width={70}
        height={70}
      />
      <div className="">
        <h1>{name}</h1>
        <p>works in {city}</p>
        <p>started working from {format(startedWorking, "PP")}</p>
        <p>hourly rate is {formatPrice(hourlyRate)}</p>
      </div>
    </div>
  );
};
