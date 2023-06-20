import React from "react";
import "./GlobalButton.scss";

const GlobalButton = ({
  classStyleName,
  additionalStyleOveride,
  buttonLabel,
  isDisabled,
  ...props
}) => {
  return (
    <button
      className={classStyleName}
      style={additionalStyleOveride}
      {...props}
      disabled={isDisabled}
    >
      {buttonLabel}
    </button>
  );
};

export default GlobalButton;
