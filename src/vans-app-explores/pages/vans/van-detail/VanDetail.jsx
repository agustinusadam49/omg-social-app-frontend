import React, { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchData } from "../../../hooks/useFetchData";
import { dummyVansArr } from "../../../../dummyData";

import "./VanDetail.scss";

export default function VanDetail() {
  const params = useParams();

  const [van, setVan] = useState(null);

  const processGetVanById = useCallback(
    (onValidate, setLoading, setErrorMessage) => {
      const myPromise = new Promise((resolve, reject) => {
        const vanDetail = dummyVansArr.find(
          (dummyVan) => dummyVan.id === Number(params.id)
        );
        setTimeout(() => {
          if (vanDetail) {
            resolve(vanDetail);
          } else {
            reject(`Van detail dengan id: ${params.id} tidak dapat ditemukan!`);
          }
        }, 1000);
      });

      const getVanDetailById = async () => {
        setLoading(true);
        try {
          const response = await myPromise;
          if (!onValidate()) return;
          setVan(response);
        } catch (error) {
          setErrorMessage(error);
        } finally {
          setLoading(false);
        }
      };

      getVanDetailById();
    },
    [params.id]
  );

  const { loading, errorMessage } = useFetchData(processGetVanById);

  return (
    <div className="van-detail-page">
      <Link
        to=".."
        relative="path"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        {"<-"} Back to all vans
      </Link>

      <div className="van-detail-page-title">Van Detail</div>

      {loading && <div>Loading ... getting data</div>}

      {!!van && (
        <div className="van-detail-card-wrapper">
          <p>Van Name: {van.name}</p>
          <p>Van Transmision: {van.transmision}</p>
          <p>Van Build Year: {van.buildYear}</p>
          <p>Van Type: {van.type}</p>
        </div>
      )}

      {!!errorMessage && <div>Error Message: {errorMessage}</div>}
    </div>
  );
}
