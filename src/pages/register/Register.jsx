import React, { useState, useReducer, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
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
import { useFormValidation } from "../../custom-hooks/useFormValidation";

import "./Register.scss";

export default function Register() {
  const navigate = useNavigate();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const [isFromNonAuthPage, setIsFromNonAuthPage] = useState(false);

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailErrorFromBE, setEmailErrorFromBE] = useState("")

  const [valuesOnBlur, setValuesOnBlur] = useState({
    fullname: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const clearRegisterField = () => {
    setFullname("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    mutate({ type: actionType.STOP_LOADING_STATUS });
  };

  const registrationRulesSchema = useMemo(
    () => ({
      fullname: {
        currentValue: fullname,
        isRequired: true,
      },
      username: {
        currentValue: username,
        isRequired: true,
      },
      email: {
        currentValue: email,
        isRequired: true,
        function: helpersWithMessage("email tidak valid", email, (val) => {
          const emailValue = val;
          return emailValue.includes("@") && emailValue.includes(".com");
        }),
      },
      password: {
        currentValue: password,
        isRequired: true,
        function: helpersWithMessage(
          "Password harus memiliki minimal 4 dan maximal 16 characters",
          password,
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
        currentValue: confirmPassword,
        isRequired: true,
        function: helpersWithMessage(
          "password tidak sama!",
          confirmPassword,
          (val) => {
            const confirmPasswordValue = val;
            const passwordValue = password;
            return confirmPasswordValue === passwordValue;
          }
        ),
      },
    }),
    [fullname, username, email, password, confirmPassword]
  );

  const { isValid, errorMessage } = useFormValidation({
    rulesSchema: registrationRulesSchema,
  });

  const doRegister = () => {
    handleAllOnBlurToTrue(true);

    if (loadingState.status) return;

    if (isValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });
      const payloadRegistration = {
        userFullname: fullname,
        userName: username,
        userEmail: email,
        userPassword: password,
      };

      console.log("payloadRegistration:", payloadRegistration);

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

          if (errorMessageFromServer.toLowerCase().includes("email")) {
            setEmailErrorFromBE(errorMessageFromServer)
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
    isFromNonAuthPage: isFromNonAuthPage,
  });

  const handleSetValuesOnBlur = (value, type) => {
    if (value) {
      setValuesOnBlur((oldObjVal) => ({
        ...oldObjVal,
        [type]: true,
      }));
    }
  };

  const handleInputErrorMessage = (type) => {
    return valuesOnBlur[type] ? getFirstError(errorMessage[type]) : [];
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

  const handleOnChangeEmail = (val) => {
    setEmail(val)

    if (emailErrorFromBE && val) {
      setEmailErrorFromBE("")
    }
  }

  return (
    <div className="register">
      <div className="register-wrapper">
        <LeftSideWording />

        <div className="register-right">
          <div className="register-box" onKeyPress={doRegisterEnter}>
            <InputTextGlobal
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              onBlur={(e) => handleSetValuesOnBlur(e.target.value, "fullname")}
              inputPlaceholder={"Fullname"}
              inputErrorMessage={handleInputErrorMessage("fullname")}
            />

            <InputTextGlobal
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              inputPlaceholder={"Username"}
              inputErrorMessage={handleInputErrorMessage("username")}
              onBlur={(e) => handleSetValuesOnBlur(e.target.value, "username")}
            />

            <InputTextGlobal
              value={email}
              onChange={(e) => handleOnChangeEmail(e.target.value)}
              onBlur={(e) => handleSetValuesOnBlur(e.target.value, "email")}
              inputPlaceholder={"Email"}
              inputErrorMessage={handleInputErrorMessage("email")}
              inputSecondErrorMessage={emailErrorFromBE}
            />

            <InputTextGlobal
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputPlaceholder={"Password"}
              onBlur={(e) => handleSetValuesOnBlur(e.target.value, "password")}
              inputType={"password"}
              inputErrorMessage={handleInputErrorMessage("password")}
            />

            <InputTextGlobal
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={(e) => handleSetValuesOnBlur(e.target.value, "confirmPassword")}
              inputPlaceholder={"Password Confirmation"}
              inputType={"password"}
              inputErrorMessage={handleInputErrorMessage("confirmPassword")}
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
