import { Suspense } from "react";
import { Link, Outlet, useLoaderData, defer, Await } from "react-router-dom";
import { processGetHostVanDetailV2 } from "../api-calls-simulations/api-calls";
import HostVanDetailNav from "../components/HostVanDetailNav";
import { modifiedToClassCssName, authUserCheck } from "../utils/index";
import Loading from "../components/Loading";

export default function HostVanDetailWithNav() {
  const hostVanDetailPromise = useLoaderData();

  const renderHostVanDetailSection = (hostVanDetailData) => {
    const hostVan = hostVanDetailData;

    return (
      <div className="host-van-detail-v2-layout-container">
        <div className="host-van-detail-v2">
          <img src={hostVan.imageUrl} alt={hostVan.name} />
          <div className="host-van-detail-v2-info-text">
            <i
              className={`van-type ${modifiedToClassCssName(hostVan.type)} selected van-type-${hostVan.type}`}
            >
              {hostVan.type}
            </i>
            <h3>{hostVan.name}</h3>
            <h4>${hostVan.price}/day</h4>
          </div>
        </div>

        <HostVanDetailNav />
        <Outlet context={hostVan} />
      </div>
    );
  };

  return (
    <section>
      <Link to="/host-v2/vans" className="host-van-detail-v2-back-button">
        &larr; <span>Back to all vans</span>
      </Link>

      <Suspense fallback={<Loading loadingName="host van detail" />}>
        <Await resolve={hostVanDetailPromise.vanHostDetail}>
          {renderHostVanDetailSection}
        </Await>
      </Suspense>
    </section>
  );
}

const getHostVanDetail = async (hostVanTheId) => {
  try {
    const hostVanDetailResponseObj =
      await processGetHostVanDetailV2(hostVanTheId);

    return hostVanDetailResponseObj;
  } catch (error) {
    throw error;
  }
};

export const hostVanDetailV2Loader = async ({ params, request }) => {
  const pathName = new URL(request.url).pathname;

  const { hostVanId } = params;

  await authUserCheck(pathName);

  return defer({ vanHostDetail: getHostVanDetail(Number(hostVanId)) });
};
