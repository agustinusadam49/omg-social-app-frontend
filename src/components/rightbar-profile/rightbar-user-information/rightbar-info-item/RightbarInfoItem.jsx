import React from "react";

import "./RightbarInfoItem.scss"

export default function RightbarInfoItem({
  leftLabel,
  rightLabel = null,
  infoValue,
}) {
  return (
    <div className="rightbar-info-item">
      <span className="rightbar-info-key">
        {leftLabel}: {rightLabel}
      </span>
      <span className="rightbar-info-value">{infoValue}</span>
    </div>
  );
}
