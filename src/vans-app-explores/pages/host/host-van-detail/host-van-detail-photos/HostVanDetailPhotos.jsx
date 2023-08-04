import React from "react";
import { useHostVanDetailData } from "../HostVanDetail";

import "./HostVanDetailPhotos.scss";

export default function HostVanDetailPhotos() {
  const { hostVanDetail } = useHostVanDetailData();

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
