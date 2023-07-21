import React, { Fragment, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "./InputTextGlobalV2.scss";

// This input text global v2 component using value and onchange,
// for now it is used in EditProfileModal.jsx modal component

const InputTextGlobal = ({
  inputValue,
  setInputValue,
  inputErrorMessage,
  inputPlaceholder = "",
  inputType = "text",
  additionalStylingClass = "",
  inputLabel = null,
  inputSecondErrorMessage = null,
  ...props
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
      return <label className={`input-label-text-global ${isErrorMessage()}`}>{inputLabel}</label>;
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

  const allMergedAdditionalStyling = () => {
    return `${isErrorMessage()} ${additionalStyling()} ${styleForTypeDate()}`;
  };

  const styleForInputTag = () => {
    return `${
      inputType === "date" ? "input-tag-date-field" : "input-tag"
    } ${allMergedAdditionalStyling()}`;
  };

  const styleForWrapperInputDate = () => {
    return `input-date-type-wrapper ${allMergedAdditionalStyling()}`;
  };

  const displayInputField = () => {
    if (inputType === "date") {
      return (
        <div className={styleForWrapperInputDate()}>
          <label htmlFor="date-icon" className="input-tag-date-icon-wrapper">
            <CalendarMonthIcon className={`calendar-month-icon ${isErrorMessage()}`} />
            <input
              id="date-icon"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="input-tag-date-icon"
              type={!seePassword ? inputType : "text"}
              {...props}
            />
          </label>

          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            className={styleForInputTag()}
            type={!seePassword ? inputType : "text"}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={inputPlaceholder}
        className={styleForInputTag()}
        type={!seePassword ? inputType : "text"}
        {...props}
      />
    );
  };

  return (
    <Fragment>
      <div className="input-text-wrapper">
        {displayLabel()}
        {displayInputField()}
        {displayEyeIcon()}
      </div>
      {displayErrorMessages()}
      {displaySecondaryErrorMessages()}
    </Fragment>
  );
};

export default InputTextGlobal;
