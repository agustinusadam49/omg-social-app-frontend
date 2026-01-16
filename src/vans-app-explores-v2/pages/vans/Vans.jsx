import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dummyVansArr } from "../../../dummyDataV2";

export default function Vans() {
  const [vans, setVans] = useState([]);

  useEffect(() => {
    const promiseToGetVans = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!!dummyVansArr.length) {
          resolve(dummyVansArr);
        } else {
          const errorObj = {
            message: "Tidak dapat menemukan data vans!",
            statusText: "Bad Request",
            code: 400,
          };
          reject(errorObj);
        }
      }, 500);
    });

    const hitGetVansPromise = async () => {
      try {
        const vanDataResponses = await promiseToGetVans;
        setVans(vanDataResponses);
      } catch (error) {
        throw error;
      }
    };

    hitGetVansPromise();

    return () => {
      setVans([]);
    };
  }, []);

  return (
    <div className="van-list-container">
      <h1>Explore our van options</h1>

      <div className="van-list">
        {!vans.length ? (
          <h2>Loading ...</h2>
        ) : (
          vans.map((van) => (
            <div key={van.id} className="van-tile">
              <Link to={`/vans/${van.id}`}>
                <img alt={van.name} src={van.imageUrl} />
                <div className="van-info">
                  <h3>{van.name}</h3>
                  <p>
                    ${van.price}
                    <span>/day</span>
                  </p>
                </div>
                <div className={`van-type ${van.type} selected`}>
                  {van.type}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
