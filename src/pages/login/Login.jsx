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
// import { useRedirectToHome } from "../../custom-hooks/useRedirectToHome";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import { getFirstError } from "../../utils/formValidationFunction";

import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  // const [isFromNonAuthPage, setIsFromNonAuthPage] = useState(false);

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
    handleAllOnBlurToTrue(true);
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
          // setIsFromNonAuthPage(true);
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

  // useRedirectToHome({
  //   isFromNonAuthPage: isFromNonAuthPage,
  // });

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

  return (
    <div className="login">
      <div className="login-wrapper">
        <LeftSideWording />

        <div className="login-right">
          <div className="login-box" onKeyPress={doLoginEnter}>
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

            {!loadingState.status ? (
              <GlobalButton
                buttonLabel="Log In"
                classStyleName="login-button"
                onClick={doLogin}
              />
            ) : (
              <div className="login-button-loading">
                <RoundedLoader baseColor="gray" secondaryColor="white" />
              </div>
            )}

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
