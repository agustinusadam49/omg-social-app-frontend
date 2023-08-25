import React, { Fragment, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./InputTextGlobal.scss";

const InputTextGlobal = ({
  inputErrorMessage,
  inputPlaceholder = "",
  inputType = "text",
  additionalStylingClass = "",
  inputLabel = null,
  inputSecondErrorMessage = null,
  ...props
}) => {
  const isDisabled = props?.disabled || false 
  const [seePassword, setSeePassword] = useState(false);

  const displayErrorMessages = () => {
    if (inputErrorMessage.length) {
      return <div className="inputErrorMessageV1">{inputErrorMessage}</div>;
    }
  };

  const displaySecondaryErrorMessages = () => {
    if (inputSecondErrorMessage) {
      return <div className="inputErrorMessageV1">{inputSecondErrorMessage}</div>;
    }
  };

  const changeIcon = (value) => {
    setSeePassword(!value);
  };

  const displayEyeIcon = () => {
    if (inputType === "password") {
      return (
        <div
          className="eye-icon-wrapper"
          onClick={() => changeIcon(seePassword)}
        >
          {!seePassword ? (
            <VisibilityOffIcon className="eye-icon" fontSize="medium" />
          ) : (
            <VisibilityIcon className="eye-icon" fontSize="medium" />
          )}
        </div>
      );
    }
  };

  const displayLabel = () => {
    if (inputLabel) {
      return <label className="input-label-text-global">{inputLabel}</label>;
    }
  };

  const isErrorMessage = () => {
    return inputErrorMessage.length ? "if-error-message" : "";
  };

  const additionalStyling = () => {
    return additionalStylingClass;
  };

  const styleForTypeDate = () => {
    return inputType === "date" ? "if-type-date" : "";
  };

  const checkDisabled = () => {
    return isDisabled ? "disabled" : ""
  }

  const styleForInputTag = () => {
    const cssStyleArr = [
      "input-tag",
      isErrorMessage(),
      additionalStyling(),
      styleForTypeDate(),
      checkDisabled(),
    ];
    const cssStyleStr = cssStyleArr.join(" ");
    // console.log("cssStyleStr:", cssStyleStr)
    return cssStyleStr;
    // return `input-tag ${isErrorMessage()} ${additionalStyling()} ${styleForTypeDate()}`;
  };

  return (
    <Fragment>
      <div className="input-text-wrapper-v1">
        {displayLabel()}
        <input
          placeholder={inputPlaceholder}
          className={styleForInputTag()}
          type={!seePassword ? inputType : "text"}
          {...props}
        />
        {displayEyeIcon()}
      </div>
      {displayErrorMessages()}
      {displaySecondaryErrorMessages()}
    </Fragment>
  );
};

export default InputTextGlobal;
