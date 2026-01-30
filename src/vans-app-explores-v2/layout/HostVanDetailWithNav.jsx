import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { processGetHostVanDetailV2 } from "../api-calls-simulations/api-calls";
import HostVanDetailNav from "../components/HostVanDetailNav";
import { modifiedToClassCssName } from "../utils/index";

export default function HostVanDetailWithNav() {
  const paramObj = useParams();
  const [hostVan, setHostVan] = useState(null);

  useEffect(() => {
    const getHostVanDetail = async (hostVanTheId) => {
      try {
        const hostVanDetailResponseObj =
          await processGetHostVanDetailV2(hostVanTheId);
        setHostVan(hostVanDetailResponseObj);
      } catch (error) {
        throw error;
      }
    };

    getHostVanDetail(Number(paramObj.hostVanId));

    return () => {
      setHostVan(null);
    };
  }, [paramObj.hostVanId]);

  if (!hostVan) {
    return <h1>Loading ....</h1>;
  }

  return (
    <section>
      <Link to="/host/vans" className="host-van-detail-v2-back-button">
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
