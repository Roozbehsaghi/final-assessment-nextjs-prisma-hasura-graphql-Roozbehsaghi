import { createClient } from "@/lib/apollo";
import { getToken } from "@/lib/auth-options";
import { ReviewsDocument, UsersDocument } from "@/lib/server-queries";
import { ReviewCard } from "./review-card";

interface ShowReviewProps {
  sitterId?: number;
}

export const ShowReviews = async ({ sitterId }: ShowReviewProps) => {
  const token = getToken();
  const client = createClient(token);

  const { data } = await client.query({ query: ReviewsDocument });

  return (
    <>
      {data.Review.map(async (review) => {
        const { data } = await client.query({ query: UsersDocument });
        const checkingId = !sitterId ? data.users[0].id : sitterId;
        const isMine = review.reviewerId === checkingId;

        if (!review.message) return;
        if (!isMine) {
          if (review.revieweeId !== checkingId) return;
        }
        return (
          <ReviewCard
            key={review.id}
            message={review.message}
            rate={review.score}
            posted={review.created_at}
            isMine={isMine}
          />
        );
      })}
    </>
  );
};
