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
import { EmptyState } from "@/components/empty-state";
import { ReviewCard } from "@/components/review-card";
import { ReviewForm } from "@/components/review-for";
import { getReviewsById } from "@/actions/getReviewsById";

const SitterProfilePage = async ({
  params: { sitterId },
}: {
  params: { sitterId: number };
}) => {
  const sId = Number(sitterId);

  const sitter = await getSitterInfo(sId);
  //@ts-ignore
  const reviews = await getReviewsById(sitter.userId!);
  if (!reviews) return console.log("something went wrong");

  if (!sitter) redirect("/");

  const token = getToken();
  const client = createClient(token);

  const { data: query, error } = await client.query({
    query: BookingsDocument,
  });
  const { data: user } = await client.query({ query: UsersDocument });

  return (
    <div
      className="flex flex-col max-w-5xl justify-center mx-auto lg:p-4 p-4"
      suppressHydrationWarning
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

          {user.users[0].id !== sitter.userId && (
            <div className="flex gap-5">
              <BookingSitter sitterId={sitterId} />
              <ReviewForm
                reviewerId={user.users[0].id}
                revieweeId={sitter.userId}
                forwhom="SITTER"
                title="Share your exprience with this sitter"
              />
            </div>
          )}
        </div>

        {user.users[0].id === sitter.userId && (
          <div className="flex flex-col gap-7">
            <UpdateSitterProfile
              city={sitter.city}
              hourlyRate={sitter.hourlyRate}
            />
          </div>
        )}
      </div>
      <Separator className="my-4" />
      <table className="table-auto border-spacing-2">
        <thead>
          <tr>
            <th>
              <p>Starting Date</p>
              <Separator />
            </th>
            <th>
              <p>Ending Date</p>
              <Separator />
            </th>
            <th>
              <p>Description</p>
              <Separator />
            </th>
            <th>
              <p>Actions</p>
              <Separator />
            </th>
          </tr>
        </thead>
        {query.Booking.map(async (query) => {
          if (query.bookeeId == sitterId) {
            return (
              <BookingCard
                key={query.id}
                bookingId={query.id}
                startingDate={query.starts_at}
                endingDate={query.end_at}
                desc={query.description}
                status={query.isCancel}
                reviewer={
                  query.bookerId === user.users[0].id
                    ? query.bookerId
                    : query.SitterProfile.userId
                }
                reviewee={
                  query.bookerId === user.users[0].id
                    ? query.SitterProfile.userId
                    : query.bookerId
                }
                forWhom={
                  sitter.userId === user.users[0].id ? "EMPLOYEE" : "SITTER"
                }
              />
            );
          } else return;
        })}
      </table>
      <Separator className="my-4" />
      <div className="flex flex-col gap-5 items-center justify-center">
        <h3 className="text-lg text-emerald-900 pb-4">
          Check reviews employees wrote for {sitter.name}
        </h3>
        <div className="relative -mx-4 mt-3 grid grid-cols-1 items-start gap-2 overflow-hidden px-4 sm:mt-3 md:grid-cols-2 lg:grid-cols-3">
          {reviews.recievedReviews.length === 0 ? (
            <EmptyState>
              <h3 className="">This sitter has not recieved any review yet</h3>
              <p>Write a review now</p>
            </EmptyState>
          ) : (
            reviews.recievedReviews.map((review) => {
              if (!review.message) return;
              return (
                <ReviewCard
                  key={review.id}
                  rating={review.score}
                  message={review.message}
                  posted={review.createdAt}
                />
              );
            })
          )}
        </div>
        <h3 className="text-lg text-muted-forground pb-4">
          Check reviews {sitter.name} wrote for employees
        </h3>
        <div className="relative -mx-4 mt-3 grid grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-3 md:grid-cols-2 lg:grid-cols-3">
          {reviews.writtenReviews.length === 0 ? (
            <EmptyState>
              <h3 className="">
                This sitter has not reviewed any employer yet
              </h3>
              <p>Share your exprience now</p>
            </EmptyState>
          ) : (
            reviews.writtenReviews.map((review) => {
              if (!review.message) return;
              return (
                <ReviewCard
                  key={review.id}
                  rating={review.score}
                  message={review.message}
                  posted={review.createdAt}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SitterProfilePage;
