import React from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import "./RepostIconSection.scss";

export default function RepostIconSection({ totalRepost, ...otherProps }) {
  return (
    <div className="repost-icon-section" {...otherProps}>
      <AutorenewIcon
        style={{ color: "rgb(87,57,100)" }}
        className="auto-renew-icon"
      />

      <div className="total-repost">{totalRepost}</div>
    </div>
  );
}
