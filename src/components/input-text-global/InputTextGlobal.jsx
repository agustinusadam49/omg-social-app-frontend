import React, { Fragment, useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useSelector, useDispatch } from "react-redux";
import { setIsClicked } from "../../redux/slices/buttonsSlice";

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
  const dispatch = useDispatch();
  const currentIsClicked = useSelector(({ button }) => button.isClicked);
  const isDisabled = props?.disabled || false;
  const [seePassword, setSeePassword] = useState(false);
  const [onBlur, setOnBlur] = useState(false);
  const [errorMessageState, setErrorMessageState] = useState(null);

  useEffect(() => {
    if (onBlur) {
      setErrorMessageState(inputErrorMessage);
    } else {
      setErrorMessageState([]);
    }
  }, [onBlur, inputErrorMessage]);

  useEffect(() => {
    if (currentIsClicked) {
      setOnBlur(true);
    }

    return () => {
      dispatch(setIsClicked({ payload: false }));
    };
  }, [currentIsClicked, dispatch]);

  const displayErrorMessages = () => {
    if (errorMessageState && errorMessageState.length) {
      return <div className="inputErrorMessageV1">{errorMessageState}</div>;
    }
  };

  const displaySecondaryErrorMessages = () => {
    if (inputSecondErrorMessage) {
      return (
        <div className="inputErrorMessageV1">{inputSecondErrorMessage}</div>
      );
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
    return (errorMessageState && errorMessageState.length) ||
      inputSecondErrorMessage
      ? "if-error-message"
      : "";
  };

  const additionalStyling = () => {
    return additionalStylingClass;
  };

  const styleForTypeDate = () => {
    return inputType === "date" ? "if-type-date" : "";
  };

  const checkDisabled = () => {
    return isDisabled ? "disabled" : "";
  };

  const styleForInputTag = () => {
    const cssStyleArr = [
      "input-tag",
      isErrorMessage(),
      additionalStyling(),
      styleForTypeDate(),
      checkDisabled(),
    ];
    const cssStyleStr = cssStyleArr.join(" ");
    return cssStyleStr;
  };

  const handleChangeOnBlur = (value) => {
    if (value) {
      setOnBlur(true);
    }
  };

  return (
    <Fragment>
      <div className="input-text-wrapper-v1">
        {displayLabel()}
        <input
          placeholder={inputPlaceholder}
          className={styleForInputTag()}
          type={!seePassword ? inputType : "text"}
          onBlur={(e) => handleChangeOnBlur(e.target.value)}
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
