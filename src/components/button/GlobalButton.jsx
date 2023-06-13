import React from "react";
import "./GlobalButton.scss";

const GlobalButton = ({
  classStyleName,
  additionalStyleOveride,
  buttonLabel,
  ...props
}) => {
  return (
    <button
      className={classStyleName}
      style={additionalStyleOveride}
      {...props}
    >
      {buttonLabel}
    </button>
  );
};

export default GlobalButton;