import React from "react";

import "./HomeTitle.scss";

export default function HomeTitle({ title, children }) {
  return (
    <div className="main-vans-home-title">
      {children || title || "Vans Life Home Page"}
    </div>
  );
}
