import React, { useState, useEffect, Fragment } from "react";
import { useParams, Link, NavLink, Outlet } from "react-router-dom";
import { dummyVansArr } from "../../../../dummyData";

import "./HostVanDetail.scss";

export default function HostVanDetail() {
  const params = useParams();
  const [hostVanDetail, setHostVanDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    const myPromiseGetData = new Promise((resolve, reject) => {
      const hostVanById = dummyVansArr.find(
        (van) => van.id === Number(params.id)
      );
      setTimeout(() => {
        if (hostVanById) {
          resolve(hostVanById);
        } else {
          reject(
            `Host van detail dengan id: ${params.id}, tidak dapat ditemukan!`
          );
        }
      }, 1000);
    });

    let isActive = true;

    const getHostVanDetailById = async () => {
      setLoading(true);
      try {
        const responseDetailData = await myPromiseGetData;
        if (!isActive) return;
        setHostVanDetail(responseDetailData);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    getHostVanDetailById();

    return () => {
      isActive = false;
      setLoading(false);
    };
  }, [params.id]);

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

      {loading && <div>Loading ... getting data</div>}

      {!!hostVanDetail && (
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
      )}

      {!!errorMessage && <div>Error Message: {errorMessage}</div>}
    </div>
  );
}
