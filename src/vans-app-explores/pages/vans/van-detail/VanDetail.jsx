import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { dummyVansArr } from "../../../../dummyData";

import "./VanDetail.scss";

export default function VanDetail() {
  const params = useParams();

  const [van, setVan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const myPromise = new Promise((resolve, reject) => {
      const vanDetail = dummyVansArr.find((dummyVan) => dummyVan.id === Number(params.id));
      setTimeout(() => {
        if (vanDetail) {
          resolve(vanDetail);
        } else {
          reject(`Van detail dengan id: ${params.id} tidak dapat ditemukan!`);
        }
      }, 1000);
    });

    let isActive = true;

    const getVanDetailById = async () => {
      setLoading(true);
      try {
        const response = await myPromise;
        if (!isActive) return;
        setVan(response);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    getVanDetailById();

    return () => {
      isActive = false;
      setVan(null);
    };
  }, [params.id]);

  return (
    <div className="van-detail-page">
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
