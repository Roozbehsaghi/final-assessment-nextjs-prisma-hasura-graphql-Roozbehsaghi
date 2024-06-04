import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface SitterCardProps {
  name: string;
  image?: string;
  city: string;
  hourlyRate: number | string;
}

export const SitterCard = ({
  name,
  image,
  city,
  hourlyRate,
}: SitterCardProps) => {
  return (
    <div className="flex flex-col gap-4 max-w-md bg-neutral-400 justify-center items-center rounded-md p-2">
      <h2 className="text-lg text-neutral-700">{name}</h2>
      <Image src="/placeholder.jpg" width={70} height={70} alt="Avatar" />
      <p>works at {city}</p>
      <span>hourly rate: {formatPrice(hourlyRate)}</span>
    </div>
  );
};