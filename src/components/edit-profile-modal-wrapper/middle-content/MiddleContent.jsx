import React from "react";

import "./MiddleContent.scss";

export default function MiddleContent({ children }) {
  return (
    <div className="middle-content">
      <div className="input-profile-box">{children}</div>
    </div>
  );
}
