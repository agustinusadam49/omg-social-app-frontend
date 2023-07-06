import React from "react";
import "./RoundedLoader.scss";

export default function RoundedLoader(props) {
  const sizeFromParent = props?.size || 22;
  const baseColor = props?.baseColor || "grey";
  const secondaryColor = props?.secondaryColor || "blue";
  const baseBorderWidth = props?.baseBorderWidth || "2px"
  const secondaryBorderWidth = props?.secondaryBorderWidth || "2px"
  
  return <div className="loader" style={{
    width: sizeFromParent,
    height: sizeFromParent,
    border: `${baseBorderWidth} solid ${baseColor}`,
    borderTop: `${secondaryBorderWidth} solid ${secondaryColor}`,
  }}></div>;
}
