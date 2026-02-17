import {
  Link,
  useSearchParams,
  useLoaderData,
  defer,
  Await,
} from "react-router-dom";
import { Suspense } from "react";
import { modifiedToClassCssName, authUserCheck } from "../../utils/index";
import { promiseToGetVansV2 } from "../../api-calls-simulations/api-calls";
import Loading from "../../components/Loading";

export default function Vans() {
  const [searchParams, setSearchParams] = useSearchParams();

  const loaderDataPromise = useLoaderData();

  const getSearchParamsString = () => {
    return searchParams.toString() ? `?${searchParams.toString()}` : "";
  };

  const doClickTypeFilter = (key, value) => {
    setSearchParams((oldParams) => {
      if (value === null) {
        oldParams.delete(key);
      } else {
        oldParams.set(key, value);
      }

      return oldParams;
    });
  };

  const renderVanElement = (vans) => {
    const vanTypeQueryList = ["Jenskin", "Aplore", "Rugged", "Lombar Fox"];

    const typeFilter = searchParams.get("type");

    const filteredVansByType = typeFilter
      ? vans.filter((vanItem) => vanItem.type === typeFilter)
      : vans;

    return (
      <>
        <div className="van-list-filter-buttons">
          {vanTypeQueryList.map((vanType, index) => (
            <button
              key={`${vanType}-${index}`}
              className={`van-type ${modifiedToClassCssName(typeFilter) === modifiedToClassCssName(vanType) ? `${modifiedToClassCssName(vanType)} selected` : ""}`}
              onClick={() => doClickTypeFilter("type", vanType)}
            >
              {vanType}
            </button>
          ))}

          {typeFilter ? (
            <button
              className={`van-type clear-filters`}
              onClick={() => doClickTypeFilter("type", null)}
            >
              Clear Filters
            </button>
          ) : null}
        </div>

        <div className="van-list">
          {filteredVansByType.map((van) => (
            <div key={van.id} className="van-tile">
              <Link
                to={`/vans-v2/${van.id}`}
                state={{
                  search: getSearchParamsString(),
                  type: typeFilter,
                }}
              >
                <img alt={van.name} src={van.imageUrl} />
                <div className="van-info">
                  <h3>{van.name}</h3>
                  <p>
                    ${van.price}
                    <span>/day</span>
                  </p>
                </div>
                <div
                  className={`van-type ${modifiedToClassCssName(van.type)} selected`}
                >
                  {van.type}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="van-list-container">
      <h1>Explore our van options</h1>

      <Suspense fallback={<Loading loadingName="vans"/>}>
        <Await resolve={loaderDataPromise.vans}>{renderVanElement}</Await>
      </Suspense>
    </div>
  );
}

const getVanList = async () => {
  try {
    const vanDataResponses = await promiseToGetVansV2();
    return vanDataResponses;
  } catch (error) {
    throw error;
  }
};

export const vansLoader = async ({ request }) => {
  const pathName = new URL(request.url).pathname;

  const vanDataPromise = getVanList();
  await authUserCheck(pathName);

  return defer({ vans: vanDataPromise });
};
