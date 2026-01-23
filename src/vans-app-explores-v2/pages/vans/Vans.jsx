import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { dummyVansArr } from "../../../dummyDataV2";
import { modifiedToClassCssName } from "./util";

const vanTypeQueryList = [
  "Jenskin",
  "Aplore",
  "Rugged",
  "Lombar Fox",
];

export default function Vans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");

  const [vans, setVans] = useState([]);
  const [error, setError] = useState(null);

  const doClickTypeFilter = (inputType) => {
    return setSearchParams(
      inputType === "Clear Filters" ? {} : { type: inputType },
    );
  };

  useEffect(() => {
    const promiseToGetVans = (typeOfVanQuery) => {
      const errorObj = {
        message: "Tidak dapat menemukan data vans!",
        statusText: "Bad Request",
        code: 400,
      };

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (dummyVansArr.length) {
            if (typeOfVanQuery) {
              const filteredVansByType = dummyVansArr.filter(
                (vanItem) =>
                  String(vanItem.type).toLowerCase() ===
                  String(typeOfVanQuery).toLowerCase(),
              );

              if (filteredVansByType.length) {
                resolve(filteredVansByType);
              } else {
                reject(errorObj);
              }
            } else {
              resolve(dummyVansArr);
            }
          } else {
            reject(errorObj);
          }
        }, 500);
      });
    };

    const hitGetVansPromise = async (vanType) => {
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
      } catch (error) {
        setError(error);
      }
    };

    hitGetVansPromise(typeFilter);

    return () => {
      setVans([]);
    };
  }, [typeFilter]);

  return (
    <div className="van-list-container">
      <h1>Explore our van options</h1>

      <div className="van-list-filter-buttons">
        {vanTypeQueryList.map((vanType, index) => (
          <button
            key={`${vanType}-${index}`}
            className={`van-type ${modifiedToClassCssName(typeFilter) === modifiedToClassCssName(vanType) ? "selected" : ""}`}
            onClick={() => doClickTypeFilter(vanType)}
          >
            {vanType}
          </button>
        ))}

        {typeFilter ? (
          <button
            className={`van-type clear-filters`}
            onClick={() => doClickTypeFilter("Clear Filters")}
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      <div className="van-list">
        {!vans.length && !error ? (
          <h2>Loading ...</h2>
        ) : error ? (
          <h1>{error.message}</h1>
        ) : (
          vans.map((van) => (
            <div key={van.id} className="van-tile">
              <Link to={`/vans/${van.id}`}>
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
