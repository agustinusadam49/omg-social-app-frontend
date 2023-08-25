import React from "react";
import "./OptionStatusDescription.scss";

export default function OptionStatusDescription({
  statusDescription,
  ...props
}) {
  const { children } = props;

  return (
    <div className="option-status-description">
      {children || statusDescription || null}
    </div>
  );
}
