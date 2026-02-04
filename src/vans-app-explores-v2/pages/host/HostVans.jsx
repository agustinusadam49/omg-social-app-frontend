import { Link, useLoaderData } from "react-router-dom";
import { processGetVanHostVans } from "../../api-calls-simulations/api-calls";
import { authUserCheck } from "../../utils/index";

export default function HostVans() {
  const hostVans = useLoaderData();

  return (
    <section>
      <h1 className="host-vans-title">Your listed vans</h1>

      <div className="host-vans-list">
        {hostVans.length ? (
          <section>
            {hostVans.map((hostVan) => (
              <Link
                to={`/host-v2/vans/${hostVan.id}`}
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

export const hostVansLoaderV2 = async () => {
  const getHostVans = async () => {
    try {
      const hostVansResponses = await processGetVanHostVans("123");
      return hostVansResponses;
    } catch (error) {
      throw error;
    }
  };

  await authUserCheck();

  return getHostVans();
};
