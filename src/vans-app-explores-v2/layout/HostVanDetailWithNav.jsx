import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { dummyVansArr } from "../../dummyDataV2";
import HostVanDetailNav from "../components/HostVanDetailNav";

export default function HostVanDetailWithNav() {
  const paramObj = useParams();
  const [hostVan, setHostVan] = useState(null);

  useEffect(() => {
    const processGetHostVanDetail = (idOfHostVan) => {
      const errorObj = {
        message: `Tidak dapat menemukan data host van detail dengan id: ${idOfHostVan}`,
        statusText: "Bad Request",
        code: 401,
      };
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (dummyVansArr.length) {
            const hostVanByIdArr = dummyVansArr.filter(
              (hostVan) => hostVan.id === idOfHostVan
            );

            if (hostVanByIdArr.length) {
              resolve(hostVanByIdArr[0]);
            } else {
              reject(errorObj);
            }
          } else {
            reject(errorObj);
          }
        }, 500);
      });
    };

    const getHostVanDetail = async (hostVanTheId) => {
      try {
        const hostVanDetailResponseObj =
          await processGetHostVanDetail(hostVanTheId);
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
            <i className={`van-type van-type-${hostVan.type}`}>
              {hostVan.type}
            </i>
            <h3>{hostVan.name}</h3>
            <h4>${hostVan.price}/day</h4>
          </div>
        </div>

        <HostVanDetailNav />
        <Outlet context={hostVan}/>
      </div>
    </section>
  );
}
