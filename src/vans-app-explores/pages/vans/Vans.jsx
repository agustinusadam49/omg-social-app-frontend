import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchData } from "../../hooks/useFetchData.js";
import { dummyVansArr } from "../../../dummyData.js";
import {
  mappedFromArrayToObj,
  orderVansByType,
} from "../../van-utils/vansDataControls.js";

import "./Vans.scss";

export default function Vans() {
  const [vans, setVans] = useState([]);

  const processGetVansV1 = useCallback((onValidate, setLoading, setErrorMessage) => {
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
  }, []);

  const { loading, errorMessage } = useFetchData(processGetVansV1);

  return (
    <div className="vans">
      <div className="van-title">Vans List</div>

      {loading && <div>Loading ... getting data</div>}

      {!!vans.length && !loading && (
        <div className="van-card-list">
          {vans.map(function (van) {
            return (
              <Link
                to={`/vans/${van.id}`}
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
