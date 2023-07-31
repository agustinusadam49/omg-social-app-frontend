import React, { useState, useRef, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formValidationV2 } from "../../utils/formValidationFunction";
import { setToLocalStorageWhenSuccess } from "../../utils/setLocalStorage";
import { loginUser } from "../../apiCalls/registerAndLoginApiFetch";
import { setIsAuthUser, setUserToken } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../components/button/GlobalButton";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../../components/rounded-loader/RoundedLoader";
import { useRedirectToHome } from "../../custom-hooks/useRedirectToHome";

import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const [isFromNonAuthPage, setIsFromNonAuthPage] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const [errorMessage, setErrorMessage] = useState({
    email: [],
    password: [],
  });

  const clearLoginField = () => {
    emailRef.current.value = "";
    passwordRef.current.value = "";
    mutate({ type: actionType.STOP_LOADING_STATUS });
  };

  const doLogin = () => {
    if (loadingState.status) return;

    const loginValidationCheck = {
      email: {
        currentValue: emailRef.current.value,
        isRequired: true,
      },
      password: {
        currentValue: passwordRef.current.value,
        isRequired: true,
      },
    };

    const isValid = formValidationV2(loginValidationCheck, setErrorMessage);

    if (isValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });
      const payloadLogin = {
        userEmail: loginValidationCheck.email.currentValue,
        userPassword: loginValidationCheck.password.currentValue,
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
          setIsFromNonAuthPage(true);
          navigate("/");
        })
        .catch((error) => {
          mutate({ type: actionType.STOP_LOADING_STATUS });
          const errorMessageFromServer = error.response.data.err.errorMessage;
          const errorForState = {
            email: [],
            password: [],
          };
          if (errorMessageFromServer.includes("email")) {
            errorForState["email"].push(errorMessageFromServer);
            setErrorMessage(errorForState);
          } else if (errorMessageFromServer.includes("Password")) {
            errorForState["password"].push(errorMessageFromServer);
            setErrorMessage(errorForState);
          } else {
            errorForState["email"].push(errorMessageFromServer);
            setErrorMessage(errorForState);
          }
        });
    }
  };

  const doLoginEnter = (event) => {
    if (event.key === "Enter") {
      doLogin();
    }
  };

  useRedirectToHome({
    isFromNonAuthPage: isFromNonAuthPage
  })

  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="login-left">
          <h3 className="login-logo">Omongin</h3>
          <span className="login-description">
            Jangan dipendem sendiri{" "}
            <strong style={{ color: "#2C2891" }}> Omongin </strong> aja ke semua
            orang.
          </span>
        </div>

        <div className="login-right">
          <div className="login-box" onKeyPress={doLoginEnter}>
            <InputTextGlobal
              inputRef={emailRef}
              inputPlaceholder={"Email"}
              inputErrorMessage={errorMessage.email}
            />

            <InputTextGlobal
              inputRef={passwordRef}
              inputPlaceholder={"password"}
              inputType={"password"}
              inputErrorMessage={errorMessage.password}
              inputSecondErrorMessage={errorMessage["other"]}
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
