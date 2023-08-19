import React from "react";
import "./OptionStatusName.scss";

export default function OptionStatusName({ statusName, ...props }) {
  const { children } = props;

  return (
    <div className="option-status-name">{children || statusName || null}</div>
  );
}
