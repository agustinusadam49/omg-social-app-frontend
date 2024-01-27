import React from "react";
import "./GlobalButton.scss";

const GlobalButton = ({
  classStyleName,
  additionalStyleOveride,
  buttonLabel = "",
  loading = false,
  isDisabled,
  renderLabel,
  ...props
}) => {
  const { children } = props;

  const renderLabelInput = (functionProp, ...params) => {
    return typeof functionProp === "function"
      ? functionProp(...params)
      : functionProp;
  };

  return (
    <button
      className={classStyleName}
      style={additionalStyleOveride}
      {...props}
      disabled={isDisabled}
    >
      {children ||
        renderLabelInput(renderLabel, {
          isLoading: loading,
          label: buttonLabel,
        }) ||
        buttonLabel}
    </button>
  );
};

export default GlobalButton;
