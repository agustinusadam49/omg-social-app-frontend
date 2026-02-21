import { Suspense } from "react";
import { Link, useLoaderData, defer, Await } from "react-router-dom";
import { processGetVanHostVans } from "../../api-calls-simulations/api-calls";
import { authUserCheck } from "../../utils/index";
import Loading from "../../components/Loading";

export default function HostVans() {
  const hostVansPromise = useLoaderData();

  const renderHostVanListSection = (hostVans) => {
    return (
      <div className="host-vans-list">
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
      </div>
    );
  };

  return (
    <section>
      <h1 className="host-vans-title">Your listed vans</h1>

      <Suspense fallback={<Loading loadingName="host vans" />}>
        <Await resolve={hostVansPromise.hostVanListData}>
          {renderHostVanListSection}
        </Await>
      </Suspense>
    </section>
  );
}

const getHostVans = async () => {
  try {
    const hostVansResponses = await processGetVanHostVans("123");
    return hostVansResponses;
  } catch (error) {
    throw error;
  }
};

export const hostVansLoaderV2 = async ({ request }) => {
  const pathName = new URL(request.url).pathname;

  await authUserCheck(pathName);

  return defer({ hostVanListData: getHostVans() });
};
