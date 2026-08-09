import { useOutletContext } from "react-router-dom";

export default function HostVanDetail() {
  const hostVanFromParentLayout = useOutletContext();

  return (
    <section className="host-van-detail-info">
      <h4>
        Name: <span>{hostVanFromParentLayout.name}</span>
      </h4>
      <h4>
        Category: <span>{hostVanFromParentLayout.type}</span>
      </h4>
      <h4>
        Description: <span>{hostVanFromParentLayout.descriptions}</span>
      </h4>
      <h4>
        Visibility: <span>Public</span>
      </h4>
    </section>
  );
}
