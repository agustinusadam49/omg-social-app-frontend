import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  mappedFromArrayToObj,
  orderVansByType,
} from "../../../van-utils/vansDataControls";
import { dummyVansArr } from "../../../../dummyData";
import { requiredAuth } from "../../../van-utils/requiredAuth";

import "./HostVans.scss";

export default function HostVans() {
  const hostVans = useLoaderData();

  return (
    <div className="host-vans">
      <div className="host-vans-title">Host Vans List</div>

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
    </div>
  );
}

export const loader = async () => {
  const promiseToGetVans = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!!dummyVansArr.length) {
        const vanObjMapped = mappedFromArrayToObj(dummyVansArr);
        const orderedVansArray = orderVansByType(vanObjMapped);
        resolve(orderedVansArray);
      } else {
        const errorObj = {
          message: "Tidak dapat menemukan data vans!",
          statusText: "Bad Request",
          code: 400,
        };
        reject(errorObj);
      }
    }, 1000);
  });

  const getVans = async () => {
    try {
      const responses = await promiseToGetVans;
      return responses;
    } catch (error) {
      throw error;
    }
  };

  await requiredAuth();

  return getVans();
};
