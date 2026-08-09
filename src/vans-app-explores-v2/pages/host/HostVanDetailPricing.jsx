import { useOutletContext } from "react-router-dom";

export default function HostVanDetailPricing() {
  const hostVanFromParentLayout = useOutletContext();

  return (
    <h3 className="host-van-price">
      ${hostVanFromParentLayout.price}
      <span>/day</span>
    </h3>
  );
}
