import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData.js";
import { dummyVansArr } from "../../../dummyData.js";
import {
  mappedFromArrayToObj,
  orderVansByType,
} from "../../van-utils/vansDataControls.js";

import "./Vans.scss";

export default function Vans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQueryParamsType = searchParams.get("type");
  const [vans, setVans] = useState([]);
  const [filteredVans, setFilteredVans] = useState(vans);
  const [vanTypes, setVanTypes] = useState({
    Aplore: false,
    Rugged: false,
    Jenskin: false,
    "Lombar Fox": false,
  });

  const processGetVansV1 = useCallback(
    (onValidate, setLoading, setErrorMessage) => {
      const promiseToGetVans = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!!dummyVansArr.length) {
            const vanObjMapped = mappedFromArrayToObj(dummyVansArr);
            const orderedVansArray = orderVansByType(vanObjMapped);
            resolve(orderedVansArray);
          } else {
            reject("Tidak ada data vans!");
          }
        }, 1000);
      });

      const hitGetVansPromise = async () => {
        setLoading(true);
        try {
          const responses = await promiseToGetVans;
          if (!onValidate()) return;
          setVans(responses);
        } catch (error) {
          setErrorMessage(error);
        } finally {
          setLoading(false);
        }
      };

      hitGetVansPromise();
    },
    []
  );

  const { loading, errorMessage } = useFetchData(processGetVansV1);

  const handleVanTypeActive = (type) => {
    setVanTypes((oldVal) => {
      return {
        ...oldVal,
        [type]: !oldVal[type],
      };
    });
  };

  useEffect(() => {
    const vanTypesArr = Object.keys(vanTypes);
    const getActiveType = (type) => vanTypes[type];
    const filterActiveVanType = (typeOfVan) => getActiveType(typeOfVan);
    const activeVanTypes = vanTypesArr.filter(filterActiveVanType);
    setSearchParams((prevParams) => {
      if (!activeVanTypes.length) {
        prevParams.delete("type");
      } else {
        prevParams.set("type", activeVanTypes.join(","));
      }
      return prevParams;
    });
  }, [vanTypes, setSearchParams]);

  useEffect(() => {
    if (vans.length) {
      const setParamsToArray = urlQueryParamsType
        ? urlQueryParamsType.split(",")
        : null;

      const filteredVans = setParamsToArray
        ? vans.filter((van) => setParamsToArray.includes(van.type))
        : vans;

      setFilteredVans(filteredVans);
    }
  }, [vans, urlQueryParamsType]);

  useEffect(() => {
    const availableVanTypes = ["Aplore", "Rugged", "Jenskin", "Lombar Fox"];
    const queryParamArrays = urlQueryParamsType
      ? urlQueryParamsType
          .split(",")
          .filter((type) => availableVanTypes.includes(type))
      : [];

    if (!!queryParamArrays.length) {
      queryParamArrays.forEach((type) => {
        setVanTypes((oldVal) => {
          return {
            ...oldVal,
            [type]: true,
          };
        });
      });
    }
  }, [urlQueryParamsType]);

  return (
    <div className="vans">
      <div className="van-title">Vans List</div>

      <div className="van-options-wording">Explore our van options</div>

      <div className="van-types-wrapper">
        {Object.keys(vanTypes).map((vanType, idx) => (
          <div
            className={`van-type-button ${vanTypes[vanType] ? "active" : null}`}
            key={idx}
            onClick={() => handleVanTypeActive(vanType)}
          >
            {vanType}
          </div>
        ))}
      </div>

      {loading && <div>Loading ... getting data</div>}

      {!!filteredVans.length && !loading && (
        <div className="van-card-list">
          {filteredVans.map(function (van) {
            return (
              <Link
                to={`/vans/${van.id}`}
                state={{ search: searchParams.toString() }}
                style={{ textDecoration: "none", color: "black" }}
                key={van.id}
                className="van-card-item"
              >
                <p>Van Name: {van.name}</p>
                <p>Van Transmision: {van.transmision}</p>
                <p>Van Build Year: {van.buildYear}</p>
                <p>Van Type: {van.type}</p>
              </Link>
            );
          })}
        </div>
      )}

      {!!errorMessage && <div>Error Message: {errorMessage}</div>}
    </div>
  );
}
