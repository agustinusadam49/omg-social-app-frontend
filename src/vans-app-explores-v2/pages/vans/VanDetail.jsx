import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { processGetVanDetailById } from "../../api-calls-simulations/api-calls";
import { modifiedToClassCssName } from "../../utils/index";

export default function VanDetail() {
  const params = useParams();
  const { state } = useLocation();

  const [vanDetail, setVanDetail] = useState(null);

  const { search, type } = state;
  const currentVanType = type || "all";

  useEffect(() => {
    const getVanDetailById = async (idOfVanDetail) => {
      try {
        const vanDetailResponses = await processGetVanDetailById(idOfVanDetail);

        setVanDetail(vanDetailResponses[0]);
      } catch (error) {
        throw error;
      }
    };

    getVanDetailById(params.vanId);

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
          <Link to={`/vans${search}`} className="van-detail-v2-back-button">
            &larr; <span>{`Back to ${currentVanType} vans`}</span>
          </Link>
          <img alt={vanDetail.name} src={vanDetail.imageUrl} />
          <div
            className={`van-type ${modifiedToClassCssName(vanDetail.type)} selected`}
          >
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
