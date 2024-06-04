import { BookingCard } from "@/components/booking-card";
import { ShowReviews } from "@/components/show-reviews";
import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import { BookingsDocument, UsersDocument } from "@/lib/server-queries";

const UserProfilePage = async () => {
  const token = getToken();
  const client = createClient(token);

  const { data, error } = await client.query({ query: BookingsDocument });

  return (
    <div className="grid grid-col-4 gap-7 justify-between max-w-5xl mx-auto p-7">
      <div className="max-w-5xl flex-col flex col-span-3">
        <h2>Check your bookings</h2>
        {data.Booking.map(async (date) => {
          const { data } = await client.query({ query: UsersDocument });
          if (date.bookerId == data.users[0].id) {
            return (
              <BookingCard
                key={date.id}
                bookingId={date.id}
                endingDate={date.starts_at}
                startingDate={date.end_at}
                desc={date.description}
                status={date.isCancel}
                sitter={date.SitterProfile.name}
                reviewer={date.bookerId}
                reviewee={date.SitterProfile.userId}
                forWhom="SITTER"
              />
            );
          } else return;
        })}
      </div>
      <div className="flex-col flex ">
        <h2>Your reviews</h2>
        <ShowReviews />
      </div>
    </div>
  );
};

export default UserProfilePage;
