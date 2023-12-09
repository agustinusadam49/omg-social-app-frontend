import React, { useState, useMemo } from "react";
import {
  useNavigate,
  useLocation,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { useFormValidation } from "../../../custom-hooks/useFormValidation";
import InputTextGlobal from "../../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../../components/button/GlobalButton";
import RequiredLoginMessage from "../../components/required-login-message/RequiredLoginMessage";
import { getFirstError } from "../../../utils/formValidationFunction";
import { isAuth } from "../../van-utils/isAuth";
import { useDispatch } from "react-redux";
import { setIsClicked } from "../../../redux/slices/buttonsSlice";

import "./LoginVan.scss";

export default function LoginVan() {
  const dispatch = useDispatch();
  const isUserAuth = isAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [searchParams] = useSearchParams();

  const messageRequiredLogin = searchParams.get("message");

  const [secondaryErrorObj, setSecondaryErrorObj] = useState({
    email: "",
    password: "",
  });

  const clearLoginField = () => {
    setEmail("");
    setPassword("");
    setSecondaryErrorObj({
      email: "",
      password: "",
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
    dispatch(setIsClicked({ payload: true }));
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

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessage[type]);
  };

  const handleOnChangeEmail = (val) => {
    setEmail(val);

    if (secondaryErrorObj.email) {
      setSecondaryErrorObj((oldObjVal) => ({
        ...oldObjVal,
        email: "",
      }));
    }
  };

  const handleOnChangePassword = (val) => {
    setPassword(val);

    if (secondaryErrorObj.password) {
      setSecondaryErrorObj((oldObjVal) => ({
        ...oldObjVal,
        password: "",
      }));
    }
  };

  if (isUserAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-van-page">
      <h2>Login to Vans App</h2>

      <div className="form-login-wrapper-card">
        {messageRequiredLogin && (
          <RequiredLoginMessage message={messageRequiredLogin} />
        )}

        <InputTextGlobal
          value={email}
          onChange={(e) => handleOnChangeEmail(e.target.value)}
          inputPlaceholder={"Email"}
          inputErrorMessage={handleInputErrorMessage("email")}
          inputSecondErrorMessage={secondaryErrorObj.email}
        />

        <InputTextGlobal
          value={password}
          onChange={(e) => handleOnChangePassword(e.target.value)}
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
