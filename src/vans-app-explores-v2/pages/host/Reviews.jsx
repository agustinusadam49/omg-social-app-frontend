import { defer, useLoaderData } from "react-router-dom";
import { processGetHostVanReviews } from "../../api-calls-simulations/api-calls";
import { authUserCheck } from "../../utils/index";
import { getPercentageDataArr, getOverallRating } from "./host-van-util";
import Loading from "../../components/Loading";
import SuspenseAndAwaitGlobal from "../../components/SuspenseAndAwaitGlobal";

export default function Reviews() {
  const reviewsDataPromise = useLoaderData();

  const renderRatingSection = (reviews) => {
    const resultPercentateArrObj = getPercentageDataArr(reviews).sort(
      (a, b) => b.rate - a.rate,
    );

    const overalRatingNum = getOverallRating(reviews);

    return (
      <>
        <div className="overall-rating-wrap">
          <h1>{overalRatingNum}</h1>
          <div></div>
          <div>overall rating</div>
        </div>

        {resultPercentateArrObj.map((ratingPercentage, idx) => (
          <div className="rating-stars" key={`rating-idx-${idx}`}>
            <div>{ratingPercentage.rate} stars</div>
            <div className="rating-bars"></div>
            <div>{ratingPercentage.percentageValue}%</div>
          </div>
        ))}

        <h3>Reviews ({reviews.length})</h3>
        {reviews
          .sort(
            (reviewA, reviewB) =>
              new Date(reviewB.date) - new Date(reviewA.date),
          )
          .map((review) => (
            <div key={review.id}>
              <div className="review">
                <div className="info">
                  <p className="name">{review.name}</p>
                  <p className="date">{review.date}</p>
                </div>
                <p>{review.text}</p>
              </div>
              <hr />
            </div>
          ))}
      </>
    );
  };

  return (
    <section className="host-reviews">
      <div className="top-text">
        <h2>Your reviews</h2>
        <p>
          Last <span>30 days</span>
        </p>
      </div>

      <SuspenseAndAwaitGlobal
        fallback={<Loading loadingName="reviews" />}
        resolveResult={reviewsDataPromise.reviews}
      >
        {renderRatingSection}
      </SuspenseAndAwaitGlobal>
    </section>
  );
}

export const hostVanReviewsLoader = async ({ request }) => {
  const pathName = new URL(request.url).pathname;

  await authUserCheck(pathName);

  return defer({ reviews: processGetHostVanReviews() });
};
