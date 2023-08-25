import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  mappedFromArrayToObj,
  orderVansByType,
} from "../../../van-utils/vansDataControls";
import { dummyVansArr } from "../../../../dummyData";

import "./HostVans.scss";

export default function HostVans() {
  const [hostVans, setHostVans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!!dummyVansArr.length) {
          const vanObjMapped = mappedFromArrayToObj(dummyVansArr);
          const vansOrderedArray = orderVansByType(vanObjMapped);
          resolve(vansOrderedArray);
        } else {
          reject("Maaf tidak ada Host Vans!");
        }
      }, 1000);
    });

    let isActive = true;

    const getVansData = async () => {
      setLoading(true);
      try {
        const responseData = await myPromise;
        if (!isActive) return;
        setHostVans(responseData);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    getVansData();

    return () => {
      isActive = false;
      setLoading(false);
    };
  }, []);

  return (
    <div className="host-vans">
      <div className="host-vans-title">Host Vans List</div>

      {loading && <div>Loading ... getting data</div>}

      {!!hostVans.length && !loading && (
        <div className="host-vans-card-list">
          {hostVans.map(function (hostVan) {
            return (
              <Link
                to={`/host/vans/${hostVan.id}`}
                style={{ textDecoration: "none", color: "black" }}
                key={hostVan.id}
                className="host-van-card-item"
              >
                <p>Van Name: {hostVan.name}</p>
                <p>Van Transmision: {hostVan.transmision}</p>
                <p>Van Build Year: {hostVan.buildYear}</p>
                <p>Van Type: {hostVan.type}</p>
              </Link>
            );
          })}
        </div>
      )}

      {!!errorMessage && <div>Error Message: {errorMessage}</div>}
    </div>
  );
}
