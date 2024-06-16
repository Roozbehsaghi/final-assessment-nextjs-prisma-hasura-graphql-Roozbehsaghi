import React from "react";
import { BookingCard } from "@/components/booking-card";
import { ReviewCard } from "@/components/review-card";
import { getToken } from "@/lib/auth-options";
import { BookingsDocument, UsersDocument } from "@/lib/server-queries";
import { createClient } from "@/lib/apollo";
import { getReviewsById } from "@/actions/getReviewsById";
import { EmptyState } from "@/components/empty-state";
import { Separator } from "@/components/ui/separator";

const UserProfilePage = async () => {
  const token = getToken();
  const client = createClient(token);

  const { data: query, error } = await client.query({
    query: BookingsDocument,
  });
  const { data: user } = await client.query({ query: UsersDocument });
  const reviews = await getReviewsById(user.users[0].id);

  return (
    <div className="grid grid-col-4 gap-7 justify-between max-w-5xl mx-auto p-7">
      <h2>Check your bookings</h2>
      <table className="table-auto border-spacing-2">
        <thead>
          <tr>
            <th>
              <p>Sitter Name</p>
              <Separator />
            </th>
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
          if (query.bookerId == user.users[0].id) {
            return (
              <BookingCard
                key={query.id}
                bookingId={query.id}
                endingDate={query.starts_at}
                startingDate={query.end_at}
                desc={query.description}
                status={query.isCancel}
                sitter={query.SitterProfile.name}
                reviewer={query.bookerId}
                reviewee={query.SitterProfile.userId}
                forWhom="SITTER"
              />
            );
          } else return;
        })}
      </table>
      <div className="flex-col flex items-center justify-center">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h3 className="text-lg text-emerald-900 pb-4">
            Check reviews written for you
          </h3>
          <div className="relative -mx-4 mt-3 grid grid-cols-1 items-start gap-2 overflow-hidden px-4 sm:mt-3 md:grid-cols-2 lg:grid-cols-3">
            {reviews.recievedReviews.length === 0 ? (
              <EmptyState>
                <h3 className="">You have not recieved any review yet</h3>
                <p>Check out later</p>
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
            Check reviews you wrote for sitters
          </h3>
          <div className="relative -mx-4 mt-3 grid grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-3 md:grid-cols-2 lg:grid-cols-3">
            {reviews.writtenReviews.length === 0 ? (
              <EmptyState>
                <h3 className="">{`You havn't reviewed anyone yet`}</h3>
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
    </div>
  );
};

export default UserProfilePage;
