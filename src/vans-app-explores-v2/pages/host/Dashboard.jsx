import { Link, defer, useLoaderData } from "react-router-dom";
import {
  processGetVanHostVans,
  processGetHostVanReviews,
} from "../../api-calls-simulations/api-calls";
import { authUserCheck } from "../../utils/index";
import { getOverallRating } from "./host-van-util";
import Loading from "../../components/Loading";
import SuspenseAndAwaitGlobal from "../../components/SuspenseAndAwaitGlobal";

export default function Dashboard() {
  const loaderDataPromise = useLoaderData();

  const renderVanSection = (vans) => {
    const hostVansEls = vans.map((van) => (
      <div className="host-van-single" key={van.id}>
        <img src={van.imageUrl} alt={`name-van-of-${van.name}`} />
        <div className="host-van-info">
          <h3>{van.name}</h3>
          <p>${van.price}/day</p>
        </div>
        <Link to={`vans/${van.id}`}>View</Link>
      </div>
    ));

    return (
      <div className="host-vans-list">
        <section>{hostVansEls}</section>
      </div>
    );
  };

  const renderReviewScore = (reviews) => {
    const overalRatingNum = getOverallRating(reviews);

    return (
      <p>
        <span>{overalRatingNum}</span>/5
      </p>
    );
  };

  return (
    <>
      <section className="host-dashboard-earnings">
        <div className="info">
          <h1>Welcome!</h1>
          <p>
            Income last <span>30 days</span>
          </p>
          <h2>$2,260</h2>
        </div>
        <Link to="income">Details</Link>
      </section>
      <section className="host-dashboard-reviews">
        <h2>Review score</h2>
        <SuspenseAndAwaitGlobal
          fallback={<Loading loadingName="..." onlyLoadingName />}
          resolveResult={loaderDataPromise.reviews}
        >
          {renderReviewScore}
        </SuspenseAndAwaitGlobal>
        <Link to="reviews">Details</Link>
      </section>
      <section className="host-dashboard-vans">
        <div className="top">
          <h2>Your listed vans</h2>
          <Link to="vans">View all</Link>
        </div>
        <SuspenseAndAwaitGlobal
          fallback={<Loading loadingName="listed vans" />}
          resolveResult={loaderDataPromise.vans}
        >
          {renderVanSection}
        </SuspenseAndAwaitGlobal>
      </section>
    </>
  );
}

export async function hostVansDashboarLoader({ request }) {
  const pathName = new URL(request.url).pathname;

  await authUserCheck(pathName);

  return defer({
    vans: processGetVanHostVans("123"),
    reviews: processGetHostVanReviews(),
  });
}
