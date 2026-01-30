import { Link, useSearchParams, useLoaderData, } from "react-router-dom";
import { modifiedToClassCssName } from "../../utils/index";
import { promiseToGetVansV2 } from "../../api-calls-simulations/api-calls";

export default function Vans() {
  const vanTypeQueryList = ["Jenskin", "Aplore", "Rugged", "Lombar Fox"];

  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");
  const vans = useLoaderData();

  const filteredVansByType = typeFilter
    ? vans.filter((vanItem) => vanItem.type === typeFilter)
    : vans;

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

  return (
    <div className="van-list-container">
      <h1>Explore our van options</h1>

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
              to={`/vans/${van.id}`}
              state={{ search: getSearchParamsString(), type: typeFilter }}
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
    </div>
  );
}

export const vansLoader = async () => {
  const hitGetVansPromise = async () => {
    try {
      const vanDataResponses = await promiseToGetVansV2();
      return vanDataResponses;
    } catch (error) {
      throw error;
    }
  };

  return hitGetVansPromise();
};
