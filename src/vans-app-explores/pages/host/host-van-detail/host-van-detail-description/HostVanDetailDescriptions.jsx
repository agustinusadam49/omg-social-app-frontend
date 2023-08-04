import React from "react";
import { useHostVanDetailData } from "../HostVanDetail";

import "./HostVanDetailDescriptions.scss";

export default function HostVanDetailDescriptions() {
  const { hostVanDetail } = useHostVanDetailData();

  return (
    <div className="host-van-detail-descriptions">
      <p>
        <strong>Name:</strong> {hostVanDetail.name}
      </p>
      <p>
        <strong>Type:</strong> {hostVanDetail.type}
      </p>
      <p>
        <strong>Descriptions:</strong> {hostVanDetail.descriptions}
      </p>
      <p>
        <strong>Visibility:</strong> {hostVanDetail.visibility}
      </p>
    </div>
  );
}
