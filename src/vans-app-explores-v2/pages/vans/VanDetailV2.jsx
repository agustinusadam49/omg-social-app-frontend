import { Link, useLocation, useLoaderData } from "react-router-dom";
import { processGetVanDetailById } from "../../api-calls-simulations/api-calls";
import { modifiedToClassCssName, authUserCheck } from "../../utils/index";

export default function VanDetailV2() {
  const { state } = useLocation();
  const vanDetail = useLoaderData();

  const currentVanType = state?.type ?? "all";
  const currentVanSearch = state?.search ?? "";

  return (
    <div className="van-detail-container">
      {
        <div className="van-detail">
          <Link
            to={`/vans-v2${currentVanSearch}`}
            className="van-detail-v2-back-button"
          >
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
      }
    </div>
  );
}

export const vanDetailLoaderV2 = async ({ params, request }) => {
  const pathName = new URL(request.url).pathname

  const { vanId } = params;

  const getVanDetailById = async (idOfVanDetail) => {
    try {
      const vanDetailResponses = await processGetVanDetailById(idOfVanDetail);

      return vanDetailResponses[0];
    } catch (error) {
      throw error;
    }
  };

  await authUserCheck(pathName);

  return getVanDetailById(vanId);
};
