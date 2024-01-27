import React from "react";
import { Link, useLocation, useLoaderData } from "react-router-dom";
import { dummyVansArr } from "../../../../dummyData";
import { requiredAuth } from "../../../van-utils/requiredAuth";

import "./VanDetail.scss";

export default function VanDetail() {
  const van = useLoaderData();
  const location = useLocation();
  const queryParamsToBackAllVans = `?${location.state?.search}` || "";

  return (
    <div className="van-detail-page">
      <Link
        to={`..${queryParamsToBackAllVans}`}
        relative="path"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        {"<-"} Back to all vans
      </Link>

      <div className="van-detail-page-title">Van Detail</div>

      <div className="van-detail-card-wrapper">
        <p>Van Name: {van.name}</p>
        <p>Van Transmision: {van.transmision}</p>
        <p>Van Build Year: {van.buildYear}</p>
        <p>Van Type: {van.type}</p>
      </div>
    </div>
  );
}

export const loader = async (props) => {
  const { params } = props;

  const promiseToGetVanById = new Promise((resolve, reject) => {
    const vanById = dummyVansArr.find((van) => van.id === Number(params.id));

    setTimeout(() => {
      if (vanById) {
        resolve(vanById);
      } else {
        const errorObj = {
          message: `Van detail dengan id: ${params.id} tidak dapat ditemukan!`,
          statusText: "Not Found",
          code: 404,
        };
        reject(errorObj);
      }
    }, 1000);
  });

  const getVanDetailById = async () => {
    try {
      const response = await promiseToGetVanById;
      return response;
    } catch (error) {
      throw error;
    }
  };

  await requiredAuth();

  return getVanDetailById();
};
