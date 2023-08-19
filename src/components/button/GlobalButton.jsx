import React from "react";
import "./GlobalButton.scss";

const GlobalButton = ({
  classStyleName,
  additionalStyleOveride,
  buttonLabel,
  isDisabled,
  ...props
}) => {
  const { children } = props;
  return (
    <button
      className={classStyleName}
      style={additionalStyleOveride}
      {...props}
      disabled={isDisabled}
    >
      {children || buttonLabel}
    </button>
  );
};

export default GlobalButton;
