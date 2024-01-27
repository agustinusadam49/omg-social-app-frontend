import React from "react";

import "./LeftSideWording.scss";

export default function LeftSideWording() {
  return (
    <div className="left-side-wording">
      <h3 className="left-side-wording-logo">Omongin</h3>
      <span className="left-side-wording-description">
        Jangan dipendem sendiri{" "}
        <strong style={{ color: "#2C2891" }}> Omongin </strong> aja ke semua
        orang.
      </span>
    </div>
  );
}
