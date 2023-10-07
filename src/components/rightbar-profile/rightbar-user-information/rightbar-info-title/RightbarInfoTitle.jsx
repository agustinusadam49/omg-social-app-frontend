import React from "react";

import "./RightbarInfoTitle.scss"

export default function RightbarInfoTitle({ title, children }) {
  return <div className="rightbar-title-profile">{title || children}</div>;
}
