import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dummyVansArr } from "../../../dummyDataV2";
export default function HostVans() {
  const [hostVans, setHostVans] = useState([]);

  useEffect(() => {
    const processGetVanHostVans = (targetedHostId) => {
      const errorObj = {
        message: "Tidak dapat menemukan data host vans!",
        statusText: "Bad Request",
        code: 400,
      };

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (dummyVansArr.length) {
            const hostVansByHostId = dummyVansArr.filter(
              (vans) => vans.hostId === targetedHostId
            );

            if (hostVansByHostId.length) {
              resolve(hostVansByHostId);
            } else {
              reject(errorObj);
            }
          } else {
            reject(errorObj);
          }
        }, 500);
      });
    };

    const getHostVans = async () => {
      try {
        const hostVansResponses = await processGetVanHostVans("123");
        setHostVans(hostVansResponses);
      } catch (error) {
        throw error;
      }
    };

    getHostVans();

    return () => {
      setHostVans([]);
    };
  }, []);
  return (
    <section>
      <h1 className="host-vans-title">Your listed vans</h1>

      <div className="host-vans-list">
        {hostVans.length ? (
          <section>
            {hostVans.map((hostVan) => (
              <Link
                to={`/host/vans/${hostVan.id}`}
                key={hostVan.id}
                className="host-vans-link-wrapper"
              >
                <div className="host-vans-single" key={hostVan.id}>
                  <img src={hostVan.imageUrl} alt={hostVan.name} />
                  <div className="host-vans-info">
                    <h3>{hostVan.name}</h3>
                    <p>${hostVan.price}/day</p>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <h2>Loading ...</h2>
        )}
      </div>
    </section>
  );
}
