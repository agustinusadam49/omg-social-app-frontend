import React, { Fragment, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./InputTextGlobal.scss";

// This input text global component does not need use value and onchange,
// instead of using inputRef, for now it used in login and register page

const InputTextGlobal = ({
  inputRef,
  inputErrorMessage,
  inputPlaceholder = "",
  inputType = "text",
  additionalStylingClass = "",
  inputLabel = null,
  inputSecondErrorMessage = null,
}) => {
  const [seePassword, setSeePassword] = useState(false);

  const displayErrorMessages = () => {
    if (inputErrorMessage.length) {
      return <div className="inputErrorMessage">{inputErrorMessage}</div>;
    }
  };

  const displaySecondaryErrorMessages = () => {
    if (inputSecondErrorMessage) {
      return <div className="inputErrorMessage">{inputSecondErrorMessage}</div>;
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

  const isErroMessage = () => {
    return inputErrorMessage.length ? "if-error-message" : "";
  };

  const additionalStyling = () => {
    return additionalStylingClass;
  };

  const styleForTypeDate = () => {
    return inputType === "date" ? "if-type-date" : "";
  };

  const styleForInputTag = () => {
    const cssStyleArr = [
      "input-tag",
      isErroMessage(),
      additionalStyling(),
      styleForTypeDate(),
    ];
    const cssStyleStr = cssStyleArr.join(" ");
    // console.log("cssStyleStr:", cssStyleStr)
    return cssStyleStr;
    // return `input-tag ${isErroMessage()} ${additionalStyling()} ${styleForTypeDate()}`;
  };

  return (
    <Fragment>
      <div className="input-text-wrapper">
        {displayLabel()}
        <input
          ref={inputRef}
          placeholder={inputPlaceholder}
          className={styleForInputTag()}
          type={!seePassword ? inputType : "text"}
        />
        {displayEyeIcon()}
      </div>
      {displayErrorMessages()}
      {displaySecondaryErrorMessages()}
    </Fragment>
  );
};

export default InputTextGlobal;
