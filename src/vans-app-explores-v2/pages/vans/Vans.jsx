import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { modifiedToClassCssName } from "../../utils/index";
import { promiseToGetVans } from "../../api-calls-simulations/api-calls";

const vanTypeQueryList = ["Jenskin", "Aplore", "Rugged", "Lombar Fox"];

export default function Vans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");

  const [vans, setVans] = useState([]);
  const [error, setError] = useState(null);
  const [loadingVans, setLoadingVans] = useState(false);

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

  useEffect(() => {
    const hitGetVansPromise = async (vanType) => {
      setLoadingVans(true);

      try {
        const vanDataResponses = await promiseToGetVans(vanType);
        if (vanType) {
          const filteredVansByType = vanDataResponses.filter(
            (vanItem) => vanItem.type === vanType,
          );
          setVans(filteredVansByType);
        } else {
          setVans(vanDataResponses);
        }
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoadingVans(false);
      }
    };

    hitGetVansPromise(typeFilter);

    return () => {
      setVans([]);
      setError(null);
      setLoadingVans(false);
    };
  }, [typeFilter]);

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
        {loadingVans ? (
          <h2>Loading ...</h2>
        ) : !loadingVans && !vans.length && error !== null ? (
          <h1>{error.message}</h1>
        ) : (
          vans.map((van) => (
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
          ))
        )}
      </div>
    </div>
  );
}
