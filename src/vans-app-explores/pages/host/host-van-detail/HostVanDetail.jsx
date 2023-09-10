import React, { Fragment } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import { dummyVansArr } from "../../../../dummyData";
import { requiredAuth } from "../../../van-utils/requiredAuth";

import "./HostVanDetail.scss";

export default function HostVanDetail() {
  const hostVanDetail = useLoaderData();

  const activeStyles = {
    color: "mediumvioletred",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bolder",
  };

  const notActiveStyles = {
    color: "black",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bolder",
  };

  return (
    <div className="host-van-detail">
      <Link
        to="/host/vans"
        relative="path"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        {"<-"} Back to all vans
      </Link>

      <div className="host-van-detail-title">Host Van Detail</div>

      <Fragment>
        <div className="host-van-detail-card-wrapper">
          <p>Van Name: {hostVanDetail.name}</p>
          <p>Van Transmision: {hostVanDetail.transmision}</p>
          <p>Van Build Year: {hostVanDetail.buildYear}</p>
          <p>Van Type: {hostVanDetail.type}</p>
        </div>

        <header className="host-van-detail-header">
          <nav className="host-van-detail-nav">
            <NavLink
              to={`.`}
              end
              style={({ isActive }) =>
                isActive ? activeStyles : notActiveStyles
              }
            >
              Details
            </NavLink>

            <NavLink
              to={`pricing`}
              style={({ isActive }) =>
                isActive ? activeStyles : notActiveStyles
              }
            >
              Pricing
            </NavLink>

            <NavLink
              to={`photos`}
              style={({ isActive }) =>
                isActive ? activeStyles : notActiveStyles
              }
            >
              Photos
            </NavLink>
          </nav>
        </header>

        <Outlet context={{ hostVanDetail }} />
      </Fragment>
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
