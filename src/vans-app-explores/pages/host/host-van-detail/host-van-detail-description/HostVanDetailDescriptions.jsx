import React from "react";
import { useOutletContext } from "react-router-dom";

import "./HostVanDetailDescriptions.scss";

export default function HostVanDetailDescriptions() {
  const { hostVanDetail } = useOutletContext();

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
