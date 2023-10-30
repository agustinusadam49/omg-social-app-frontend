import React, { useState, useReducer, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setToLocalStorageWhenSuccess } from "../../utils/setLocalStorage";
import { loginUser } from "../../apiCalls/registerAndLoginApiFetch";
import { setIsAuthUser, setUserToken } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../components/button/GlobalButton";
import LeftSideWording from "../../components/auth-feature/LeftSideWording";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../../components/rounded-loader/RoundedLoader";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import { getFirstError } from "../../utils/formValidationFunction";
import { setIsClicked } from "../../redux/slices/buttonsSlice";

import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    dispatch(setIsClicked({ payload: false }));
    mutate({ type: actionType.STOP_LOADING_STATUS });
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

  const doLogin = () => {
    dispatch(setIsClicked({ payload: true }));
    setSecondaryErrorObj({
      email: "",
      password: "",
    });

    if (loadingState.status) return;

    if (isValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });
      const payloadLogin = {
        userEmail: email,
        userPassword: password,
      };

      loginUser(payloadLogin)
        .then((userResponseLogin) => {
          mutate({ type: actionType.RUN_LOADING_STATUS });
          const successResponse = userResponseLogin.data;
          setToLocalStorageWhenSuccess(
            successResponse.user_token,
            successResponse.user_name,
            successResponse.user_id
          );
          clearLoginField();
          dispatch(
            setUserToken({
              currentUserToken: successResponse.user_token,
            })
          );
          dispatch(setIsAuthUser({ isAuth: true }));
          const from = location?.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        })
        .catch((error) => {
          mutate({ type: actionType.STOP_LOADING_STATUS });
          const errorMessageFromServer = error.response.data.err.errorMessage;
          if (errorMessageFromServer.includes("email")) {
            setSecondaryErrorObj((oldObjVal) => ({
              ...oldObjVal,
              email: errorMessageFromServer,
            }));
          } else if (errorMessageFromServer.includes("Password")) {
            setSecondaryErrorObj((oldObjVal) => ({
              ...oldObjVal,
              password: errorMessageFromServer,
            }));
          } else {
            setSecondaryErrorObj((oldObjVal) => ({
              ...oldObjVal,
              email: errorMessageFromServer,
            }));
          }
        });
    }
  };

  const doLoginEnter = (event) => {
    if (event.key === "Enter") {
      doLogin();
    }
  };

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessage[type]);
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

  return (
    <div className="login">
      <div className="login-wrapper">
        <LeftSideWording />

        <div className="login-right">
          <div className="login-box" onKeyPress={doLoginEnter}>
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
              loading={loadingState.status}
              isDisabled={loadingState.status}
              renderLabel={({ label, isLoading }) =>
                !isLoading ? (
                  <div>{label}</div>
                ) : (
                  <RoundedLoader baseColor="gray" secondaryColor="white" />
                )
              }
            />

            <Link className="login-forgot-wrapper" to="/forgot-password">
              <span className="login-forgot">Forgot Password?</span>
            </Link>

            <Link className="login-register-button" to="/register">
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
