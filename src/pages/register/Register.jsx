import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
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
import "./Register.scss";

export default function Register() {
  const dispatch = useDispatch();

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
  };

  const doRegister = () => {
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
      const payloadRegistration = {
        userFullname: registrationValidateCheck.fullname.currentValue,
        userName: registrationValidateCheck.username.currentValue,
        userEmail: registrationValidateCheck.email.currentValue,
        userPassword: registrationValidateCheck.password.currentValue,
      };

      registerNewUser(payloadRegistration)
        .then((userResponseRegister) => {
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
        })
        .catch((error) => {
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

  return (
    <div className="register">

      <div className="register-wrapper">

        <div className="register-left">
          <h3 className="register-logo">Omongin</h3>
          <span className="register-description">
            {"Jangan dipendem sendiri "}
            <strong style={{ color: "#2C2891" }}>Omongin</strong>
            {" aja ke semua orang."}
          </span>
        </div>

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

            <GlobalButton
              buttonLabel={"Sign Up"}
              classStyleName="register-button"
              onClick={doRegister}
            />

            <Link className="register-login-button" to="/login">
              Log In
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
