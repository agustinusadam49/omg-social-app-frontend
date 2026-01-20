import { useOutletContext } from "react-router-dom";

export default function HostVanDetailPhotos() {
  const hostVanFromParentLayout = useOutletContext();

  return (
    <img
      src={hostVanFromParentLayout.imageUrl}
      alt={hostVanFromParentLayout.name}
      className="host-van-detail-image"
    />
  );
}
