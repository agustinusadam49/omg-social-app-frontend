import React from "react";
import { useOutletContext } from "react-router-dom";

import "./HostVanDetailPhotos.scss";

export default function HostVanDetailPhotos() {
  const { hostVanDetail } = useOutletContext();

  return (
    <div className="host-van-detail-photos">
      <ol>
        {hostVanDetail.photos.map(function (item, idx) {
          return <li key={idx}>{item}</li>;
        })}
      </ol>
    </div>
  );
}
