import React, {
  useState,
  useRef,
  useReducer,
  useMemo,
  useEffect,
  Fragment,
} from "react";
// import { Link } from "react-router-dom";
import {
  formValidationV2,
  helpersWithMessage,
  getFirstError,
} from "../../utils/formValidationFunction";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../components/button/GlobalButton";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../../components/rounded-loader/RoundedLoader";
import {
  getUserByEmail,
  changeForgotPassword,
} from "../../apiCalls/forgotPassword";
import { useNavigate } from 'react-router-dom';

import "./ForgotPassword.scss";

export default function ForgotPassword() {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const navigate = useNavigate();

  const [emailInLocalStorage, setEmailInLocalStorage] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [errorMessageCheckEmail, setErrorMessageCheckEmail] = useState({
    email: [],
  });

  const [errorMessagePassword, setErrorMessagePassword] = useState({
    password: [],
    confirmPassword: [],
  });

  const clearField = () => {
    emailRef.current.value = "";
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
  };

  const doChangePassword = () => {
    if (loadingState.status) return;

    const passwordValidationCheck = {
      password: {
        currentValue: passwordRef.current.value,
        isRequired: true,
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

    const isPasswordValid = formValidationV2(
      passwordValidationCheck,
      setErrorMessagePassword
    );

    if (isPasswordValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });
      const payload = {
        userPassword: passwordValidationCheck.password.currentValue,
      };

      const emailParam = emailRef.current.value;

      changeForgotPassword(emailParam, payload)
        .then((response) => {
          const success = response.data.success
          if (success) {
            mutate({ type: actionType.STOP_LOADING_STATUS });
            clearField()
            navigate("/login")
          }
        })
        .catch((error) => {
          console.log(error);
          mutate({ type: actionType.STOP_LOADING_STATUS });
        });
    }
  };

  const doEmailCheck = () => {
    if (loadingState.status) return;

    const emailValidationCheck = {
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
    };

    const isValid = formValidationV2(
      emailValidationCheck,
      setErrorMessageCheckEmail
    );

    if (isValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });

      const payloadCheckEmail = {
        userEmail: emailValidationCheck.email.currentValue,
      };

      getUserByEmail(payloadCheckEmail.userEmail)
        .then((response) => {
          const success = response.data.success;
          if (success) {
            const userData = response.data.data;
            const userEmailFromResponse = userData.userEmail;
            localStorage.setItem(
              "user_email_forgot_password",
              userEmailFromResponse
            );
            const email = localStorage.getItem("user_email_forgot_password");
            setEmailInLocalStorage(email);
            mutate({ type: actionType.STOP_LOADING_STATUS });
          }
        })
        .catch((error) => {
          mutate({ type: actionType.STOP_LOADING_STATUS });
          const errorMessageFromServer = error.response.data.err.message;
          const errorForState = {
            email: [],
          };

          if (errorMessageFromServer.toLowerCase().includes("email")) {
            errorForState["email"].push(errorMessageFromServer);
            setErrorMessageCheckEmail(errorForState);
          }
        });
    }
  };

  const handleChangePasswordWithEnter = (event) => {
    if (event.key === "Enter") {
      if (!isEmailValidated) {
        doEmailCheck();
      } else {
        doChangePassword();
      }
    }
  };

  const isEmailValidated = useMemo(
    () => emailInLocalStorage,
    [emailInLocalStorage]
  );

  useEffect(() => {
    const userEmailInLocalStorage = localStorage.getItem(
      "user_email_forgot_password"
    );

    if (userEmailInLocalStorage) {
      emailRef.current.value = userEmailInLocalStorage;
      setEmailInLocalStorage(userEmailInLocalStorage);
    }

    return () => {
      localStorage.removeItem("user_email_forgot_password");
    };
  }, []);

  return (
    <div className="forgot-password">
      <div className="forgot-password-wrapper">
        <div className="forgot-password-left">
          <h3 className="forgot-password-logo">Omongin</h3>
          <span className="forgot-password-description">
            Jangan dipendem sendiri{" "}
            <strong style={{ color: "#2C2891" }}> Omongin </strong> aja ke semua
            orang.
          </span>
        </div>

        <div className="forgot-password-right">
          <div
            className="forgot-password-box"
            onKeyPress={handleChangePasswordWithEnter}
          >
            <InputTextGlobal
              inputRef={emailRef}
              inputPlaceholder={"Masukan Email"}
              inputErrorMessage={getFirstError(errorMessageCheckEmail.email)}
              disabled={isEmailValidated}
            />

            {isEmailValidated && (
              <Fragment>
                <InputTextGlobal
                  inputRef={passwordRef}
                  inputPlaceholder={"New Password"}
                  inputType={"password"}
                  inputErrorMessage={getFirstError(
                    errorMessagePassword.password
                  )}
                />

                <InputTextGlobal
                  inputRef={confirmPasswordRef}
                  inputPlaceholder={"New Password Confirmation"}
                  inputType={"password"}
                  inputErrorMessage={getFirstError(
                    errorMessagePassword.confirmPassword
                  )}
                />
              </Fragment>
            )}

            {!loadingState.status ? (
              <GlobalButton
                buttonLabel={
                  !isEmailValidated ? "Check Email" : "Change Password"
                }
                classStyleName="forgot-password-button"
                onClick={!isEmailValidated ? doEmailCheck : doChangePassword}
              />
            ) : (
              <div className="forgot-password-button-loading">
                <RoundedLoader baseColor="gray" secondaryColor="white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
