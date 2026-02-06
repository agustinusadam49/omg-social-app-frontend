import { Link, Outlet, useLoaderData } from "react-router-dom";
import { processGetHostVanDetailV2 } from "../api-calls-simulations/api-calls";
import HostVanDetailNav from "../components/HostVanDetailNav";
import { modifiedToClassCssName, authUserCheck } from "../utils/index";

export default function HostVanDetailWithNav() {
  const hostVan = useLoaderData();

  return (
    <section>
      <Link to="/host-v2/vans" className="host-van-detail-v2-back-button">
        &larr; <span>Back to all vans</span>
      </Link>
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
    </section>
  );
}

export const hostVanDetailV2Loader = async ({ params, request }) => {
  const pathName = new URL(request.url).pathname;

  const { hostVanId } = params;

  const getHostVanDetail = async (hostVanTheId) => {
    try {
      const hostVanDetailResponseObj =
        await processGetHostVanDetailV2(hostVanTheId);

      return hostVanDetailResponseObj;
    } catch (error) {
      throw error;
    }
  };

  await authUserCheck(pathName);

  return getHostVanDetail(Number(hostVanId));
};
