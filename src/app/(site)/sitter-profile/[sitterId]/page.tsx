import React from "react";
import { redirect } from "next/navigation";
import { SitterInfo } from "../../_component/sitter-info";
import { getSitterInfo } from "@/actions/getSitterInfo";
import { BookingSitter } from "@/components/book-sitter";
import { getToken } from "@/lib/auth-options";
import { createClient } from "@/lib/apollo";
import { BookingsDocument, UsersDocument } from "@/lib/server-queries";
import { Separator } from "@/components/ui/separator";
import { BookingCard } from "@/components/booking-card";
import { ShowReviews } from "@/components/show-reviews";
import { UpdateSitterProfile } from "../../_component/update-sitter-button";

const SitterProfilePage = async ({
  params: { sitterId },
}: {
  params: { sitterId: number };
}) => {
  //@ts-ignore
  const sitter = await getSitterInfo(parseInt(sitterId));

  if (!sitter) {
    redirect("/");
  }
  const token = getToken();
  const client = createClient(token);

  const { data, error } = await client.query({ query: BookingsDocument });
  return (
    <div
      className="flex flex-col max-w-5xl justify-center mx-auto lg:p-4 py-24 px-4"
      suppressHydrationWarning={true}
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-7">
          <div className="">
            <SitterInfo
              city={sitter.city}
              hourlyRate={sitter.hourlyRate}
              name={sitter.name}
              startedWorking={sitter.createdAt}
              image={sitter.userImage}
            />
          </div>
          <div className="">
            <BookingSitter sitterId={sitterId} />
          </div>
        </div>
        <div className="flex flex-col gap-7">
          <UpdateSitterProfile
            city={sitter.city}
            hourlyRate={sitter.hourlyRate}
          />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="">
        {data.Booking.map(async (date) => {
          const { data } = await client.query({ query: UsersDocument });

          if (date.bookeeId == sitterId) {
            return (
              <BookingCard
                key={date.id}
                bookingId={date.id}
                endingDate={date.starts_at}
                startingDate={date.end_at}
                desc={date.description}
                status={date.isCancel}
                reviewer={
                  date.bookerId === data.users[0].id
                    ? date.bookerId
                    : date.SitterProfile.userId
                }
                reviewee={
                  date.bookerId !== data.users[0].id
                    ? date.bookerId
                    : date.SitterProfile.userId
                }
                forWhom={
                  date.bookerId === data.users[0].id ? "EMPLOYEE" : "SITTER"
                }
              />
            );
          } else return;
        })}
      </div>
      <Separator className="my-4" />

      <div className="">
        <h3 className="text-lg text-emerald-900 pb-4">
          Check reviews {sitter.name} wrote for employees
        </h3>
        <ShowReviews sitterId={sitter.userId} />
      </div>
    </div>
  );
};

export default SitterProfilePage;
