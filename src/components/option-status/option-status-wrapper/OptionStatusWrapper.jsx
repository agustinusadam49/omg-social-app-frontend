import React from "react";

import "./OptionStatusWrapper.scss";

export default function OptionStatusWrapper({ ...props }) {
  const { children } = props;
  return <div className="option-status-wrapper">{children || null}</div>;
}
