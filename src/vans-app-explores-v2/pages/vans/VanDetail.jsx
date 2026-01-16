import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { dummyVansArr } from "../../../dummyDataV2.js";

export default function VanDetail() {
  const params = useParams();
  const [vanDetail, setVanDetail] = useState(null);

  useEffect(() => {
    const processGetVanDetailById = (idOfVanDetail) => {
      const errorObj = {
        message: `Tidak dapat menemukan data van detail dengan id: ${idOfVanDetail}`,
        statusText: "Bad Request",
        code: 400,
      };

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!!dummyVansArr.length) {
            const vanDetailById = dummyVansArr.filter(
              (van) => van.id === Number(idOfVanDetail)
            );

            if (vanDetailById.length) {
              resolve(vanDetailById);
            } else {
              reject(errorObj);
            }
          } else {
            reject(errorObj);
          }
        }, 500);
      });
    };

    const getVanDetailById = async () => {
      try {
        const vanDetailResponses = await processGetVanDetailById(params.vanId);

        setVanDetail(vanDetailResponses[0]);
      } catch (error) {
        throw error;
      }
    };

    getVanDetailById();

    return () => {
      setVanDetail(null);
    };
  }, [params.vanId]);

  return (
    <div className="van-detail-container">
      {!vanDetail ? (
        <h2>Loading ....</h2>
      ) : (
        <div className="van-detail">
          <img alt={vanDetail.name} src={vanDetail.imageUrl} />
          <div className={`van-type ${vanDetail.type} selected`}>
            {vanDetail.type}
          </div>
          <h2>{vanDetail.name}</h2>
          <p className="van-price">
            <span>${vanDetail.price}</span>/day
          </p>
          <p>{vanDetail.descriptions}</p>
          <button className="link-button">Rent this van</button>
        </div>
      )}
    </div>
  );
}
