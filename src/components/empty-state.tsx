import Image from "next/image";

export const EmptyState = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="">
        <Image src="/empty.png" alt="Empty-State" width={250} height={250} />
      </div>
      <div className="">{children}</div>
    </div>
  );
};
