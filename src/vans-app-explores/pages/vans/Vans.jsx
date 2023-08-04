import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dummyVansArr } from "../../../dummyData.js";

import "./Vans.scss";

export default function Vans() {
  const [vans, setVans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const mappedFromArrayToObj = (vans) => {
    const vansLocal = [...vans];
    const mapObj = new Map();
    const mappedObjVan = vansLocal.reduce((newObj, vanObjItem) => {
      newObj = mapObj.set(vanObjItem.id, vanObjItem);
      return newObj;
    }, {});

    return mappedObjVan;
  };

  const orderVansByType = (vans) => {
    const vansLocal = new Map(vans);
    const orderedType = [
      [2, "Aplore"],
      [6, "Rugged"],
      [5, "Rugged"],
      [3, "Jenskin"],
      [1, "Jenskin"],
      [4, "Lombar Fox"],
    ];
    const result = orderedType.map((item) => vansLocal.get(item[0]));
    return result;
  };

  useEffect(() => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!!dummyVansArr.length) {
          const vanObjMapped = mappedFromArrayToObj(dummyVansArr);
          const vansOrderedArray = orderVansByType(vanObjMapped);
          resolve(vansOrderedArray);
        } else {
          reject("Tidak ada data!");
        }
      }, 1000);
    });

    let isActive = true;

    const getVansData = async () => {
      setLoading(true);
      try {
        const responseVansData = await myPromise;

        if (!isActive) return;

        setVans(responseVansData);
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
    <div className="vans">
      <div className="van-title">Vans List</div>

      {loading && <div>Loading ... getting data</div>}

      {!!vans.length && !loading && (
        <div className="van-card-list">
          {vans.map(function (van, idx) {
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
