import React, { useState, useMemo } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useFormValidation } from "../../../custom-hooks/useFormValidation";
import InputTextGlobal from "../../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../../components/button/GlobalButton";
import { getFirstError } from "../../../utils/formValidationFunction";
import { isAuth } from "../../van-utils/isAuth";

import "./LoginVan.scss";

export default function LoginVan() {
  const isUserAuth = isAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [secondaryErrorObj, setSecondaryErrorObj] = useState({
    email: "",
    password: "",
  });

  const [valuesOnBlur, setValuesOnBlur] = useState({
    email: false,
    password: false,
  });

  const clearLoginField = () => {
    setEmail("");
    setPassword("");
    setSecondaryErrorObj({
      email: "",
      password: "",
    });
    setValuesOnBlur({
      email: false,
      password: false,
    });
  };

  const loginRulesSchema = useMemo(
    () => ({
      email: {
        currentValue: email,
        isRequired: true,
      },
      password: {
        currentValue: password,
        isRequired: true,
      },
    }),
    [email, password]
  );

  const { isValid, errorMessage } = useFormValidation({
    rulesSchema: loginRulesSchema,
  });

  const setToLocalStorage = (payload) => {
    const { userEmail, userPassword } = payload;

    localStorage.setItem("email", userEmail);
    localStorage.setItem("password", userPassword);
  };

  const doLogin = () => {
    handleAllOnBlurToTrue(true);
    setSecondaryErrorObj({
      email: "",
      password: "",
    });

    if (isValid) {
      const payloadLogin = {
        userEmail: email,
        userPassword: password,
      };
      setToLocalStorage(payloadLogin);
      clearLoginField();
      const from = location?.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  };

  const handleSetValuesOnBlur = (value, type) => {
    if (value) {
      setValuesOnBlur((oldObjVal) => ({
        ...oldObjVal,
        [type]: true,
      }));
    }
  };

  const handleAllOnBlurToTrue = (boolVal) => {
    const onBlurObjKeys = Object.keys(valuesOnBlur);

    for (let i = 0; i < onBlurObjKeys.length; i++) {
      setValuesOnBlur((oldValObj) => ({
        ...oldValObj,
        [onBlurObjKeys[i]]: boolVal,
      }));
    }
  };

  const handleInputErrorMessage = (type) => {
    return valuesOnBlur[type] ? getFirstError(errorMessage[type]) : [];
  };

  const handleOnChangeEmail = (val) => {
    setEmail(val);

    if (secondaryErrorObj.email && (val || !val)) {
      setSecondaryErrorObj((oldObjVal) => ({
        ...oldObjVal,
        email: "",
      }));
    }
  };

  const handleOnChangePassword = (val) => {
    setPassword(val);

    if (secondaryErrorObj.password && (val || !val)) {
      setSecondaryErrorObj((oldObjVal) => ({
        ...oldObjVal,
        password: "",
      }));
    }
  };

  if (isUserAuth) {
    return <Navigate to="/"/>
  }

  return (
    <div className="login-van-page">
      <h2>Login to Vans App</h2>

      <div className="form-login-wrapper-card">
        <InputTextGlobal
          value={email}
          onChange={(e) => handleOnChangeEmail(e.target.value)}
          onBlur={(e) => handleSetValuesOnBlur(e.target.value, "email")}
          inputPlaceholder={"Email"}
          inputErrorMessage={handleInputErrorMessage("email")}
          inputSecondErrorMessage={secondaryErrorObj.email}
        />

        <InputTextGlobal
          value={password}
          onChange={(e) => handleOnChangePassword(e.target.value)}
          onBlur={(e) => handleSetValuesOnBlur(e.target.value, "password")}
          inputPlaceholder={"password"}
          inputType={"password"}
          inputErrorMessage={handleInputErrorMessage("password")}
          inputSecondErrorMessage={secondaryErrorObj.password}
        />

        <GlobalButton
          buttonLabel="Log In"
          classStyleName="login-button"
          onClick={doLogin}
        />
      </div>
    </div>
  );
}
