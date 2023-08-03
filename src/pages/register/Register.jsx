import React, { useState, useRef, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  formValidationV2,
  helpersWithMessage,
  getFirstError,
} from "../../utils/formValidationFunction";
import { setToLocalStorageWhenSuccess } from "../../utils/setLocalStorage";
import { registerNewUser } from "../../apiCalls/registerAndLoginApiFetch";
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
import { useRedirectToHome } from "../../custom-hooks/useRedirectToHome";

import "./Register.scss";

export default function Register() {
  const navigate = useNavigate();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const [isFromNonAuthPage, setIsFromNonAuthPage] = useState(false);

  const fullnameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [errorMessage, setErrorMessage] = useState({
    fullname: [],
    username: [],
    email: [],
    password: [],
    confirmPassword: [],
  });

  const clearRegisterField = () => {
    fullnameRef.current.value = "";
    usernameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
    mutate({ type: actionType.STOP_LOADING_STATUS });
  };

  const doRegister = () => {
    if (loadingState.status) return;

    const registrationValidateCheck = {
      fullname: {
        currentValue: fullnameRef.current.value,
        isRequired: true,
      },
      username: {
        currentValue: usernameRef.current.value,
        isRequired: true,
      },
      email: {
        currentValue: emailRef.current.value,
        isRequired: true,
        function: helpersWithMessage(
          "email tidak valid",
          emailRef.current.value,
          (val) => {
            const emailValue = val;
            return emailValue.includes("@") && emailValue.includes(".com");
          }
        ),
      },
      password: {
        currentValue: passwordRef.current.value,
        isRequired: true,
        function: helpersWithMessage(
          "Password harus memiliki minimal 4 dan maximal 16 characters",
          passwordRef.current.value,
          (val) => {
            const minCharacterLength = 4;
            const maxCharacterLength = 16;
            const passwordValue = val;
            return (
              passwordValue.length >= minCharacterLength &&
              passwordValue.length <= maxCharacterLength
            );
          }
        ),
      },
      confirmPassword: {
        currentValue: confirmPasswordRef.current.value,
        isRequired: true,
        function: helpersWithMessage(
          "password tidak sama!",
          confirmPasswordRef.current.value,
          (val) => {
            const confirmPasswordValue = val;
            const passwordValue = passwordRef.current.value;
            return confirmPasswordValue === passwordValue;
          }
        ),
      },
    };

    const isValid = formValidationV2(
      registrationValidateCheck,
      setErrorMessage
    );

    if (isValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });
      const payloadRegistration = {
        userFullname: registrationValidateCheck.fullname.currentValue,
        userName: registrationValidateCheck.username.currentValue,
        userEmail: registrationValidateCheck.email.currentValue,
        userPassword: registrationValidateCheck.password.currentValue,
      };

      registerNewUser(payloadRegistration)
        .then((userResponseRegister) => {
          mutate({ type: actionType.RUN_LOADING_STATUS });
          const successResponse = userResponseRegister.data;
          setToLocalStorageWhenSuccess(
            successResponse.user_token,
            successResponse.user_name,
            successResponse.user_id
          );
          clearRegisterField();
          dispatch(
            setUserToken({ currentUserToken: successResponse.user_token })
          );
          dispatch(setIsAuthUser({ isAuth: true }));
          setIsFromNonAuthPage(true);
          navigate("/");
        })
        .catch((error) => {
          mutate({ type: actionType.STOP_LOADING_STATUS });
          const errorMessageFromServer = error.response.data.err.errorMessage;
          const errorForState = {
            fullname: [],
            username: [],
            email: [],
            password: [],
            confirmPassword: [],
          };

          if (errorMessageFromServer.toLowerCase().includes("email")) {
            errorForState["email"].push(errorMessageFromServer);
            setErrorMessage(errorForState);
          } else {
            console.log("error need to be handled", errorMessageFromServer);
          }
        });
    }
  };

  const doRegisterEnter = (event) => {
    if (event.key === "Enter") {
      doRegister();
    }
  };

  useRedirectToHome({
    isFromNonAuthPage: isFromNonAuthPage
  })

  return (
    <div className="register">
      <div className="register-wrapper">
        <LeftSideWording />

        <div className="register-right">
          <div className="register-box" onKeyPress={doRegisterEnter}>
            <InputTextGlobal
              inputRef={fullnameRef}
              inputPlaceholder={"Fullname"}
              inputErrorMessage={getFirstError(errorMessage.fullname)}
            />

            <InputTextGlobal
              inputRef={usernameRef}
              inputPlaceholder={"Username"}
              inputErrorMessage={getFirstError(errorMessage.username)}
            />

            <InputTextGlobal
              inputRef={emailRef}
              inputPlaceholder={"Email"}
              inputErrorMessage={getFirstError(errorMessage.email)}
            />

            <InputTextGlobal
              inputRef={passwordRef}
              inputPlaceholder={"Password"}
              inputType={"password"}
              inputErrorMessage={getFirstError(errorMessage.password)}
            />

            <InputTextGlobal
              inputRef={confirmPasswordRef}
              inputPlaceholder={"Password Confirmation"}
              inputType={"password"}
              inputErrorMessage={getFirstError(errorMessage.confirmPassword)}
            />

            {!loadingState.status ? (
              <GlobalButton
                buttonLabel="Sign Up"
                classStyleName="register-button"
                onClick={doRegister}
              />
            ) : (
              <div className="register-button-loading">
                <RoundedLoader baseColor="gray" secondaryColor="white" />
              </div>
            )}

            <Link className="register-login-button" to="/login">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
