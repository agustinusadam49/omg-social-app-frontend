import React, {
  useState,
  useReducer,
  useMemo,
  useEffect,
  Fragment,
} from "react";
import {
  helpersWithMessage,
  getFirstError,
} from "../../utils/formValidationFunction";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../components/button/GlobalButton";
import LeftSideWording from "../../components/auth-feature/LeftSideWording";
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
import { useNavigate } from "react-router-dom";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import { useDispatch } from "react-redux";
import { setIsClicked } from "../../redux/slices/buttonsSlice";
import ForgotPasswordWrapper from "../../components/forgot-password-wrapper/ForgotPasswordWrapper";
import ForgotPasswordRightSection from "../../components/forgot-password-right-section/ForgotPasswordRightSection";
import ForgotPasswordBox from "../../components/forgot-password-box/ForgotPasswordBox";

import "./ForgotPassword.scss";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const navigate = useNavigate();

  const [emailInLocalStorage, setEmailInLocalStorage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secondaryErrorObj, setSecondaryErrorObj] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const checkEmailRules = useMemo(
    () => ({
      email: {
        currentValue: email,
        isRequired: true,
        function: helpersWithMessage("email tidak valid", email, (val) => {
          const emailValue = val;
          return emailValue.includes("@") && emailValue.includes(".com");
        }),
      },
    }),
    [email]
  );

  const passwordRules = useMemo(
    () => ({
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
    [password, confirmPassword]
  );

  const { isValid, errorMessage } = useFormValidation({
    rulesSchema: checkEmailRules,
  });

  const { isValid: isPasswordValid, errorMessage: errorMessagePassword } =
    useFormValidation({
      rulesSchema: passwordRules,
    });

  const clearField = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSecondaryErrorObj({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const doChangePassword = () => {
    dispatch(setIsClicked({ payload: true }));

    if (loadingState.status) return;

    if (isPasswordValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });
      const payload = {
        userPassword: password,
      };

      const emailParam = email;

      changeForgotPassword(emailParam, payload)
        .then((response) => {
          const success = response.data.success;
          if (success) {
            mutate({ type: actionType.STOP_LOADING_STATUS });
            clearField();
            navigate("/login");
          }
        })
        .catch((error) => {
          console.log(error);
          mutate({ type: actionType.STOP_LOADING_STATUS });
        });
    }
  };

  const doEmailCheck = () => {
    dispatch(setIsClicked({ payload: true }));

    if (loadingState.status) return;

    if (isValid) {
      mutate({ type: actionType.RUN_LOADING_STATUS });

      const payloadCheckEmail = {
        userEmail: email,
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

          if (errorMessageFromServer.toLowerCase().includes("email")) {
            setSecondaryErrorObj((oldObjVal) => ({
              ...oldObjVal,
              email: errorMessageFromServer,
            }));
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
      setEmail(userEmailInLocalStorage);
      setEmailInLocalStorage(userEmailInLocalStorage);
    }

    return () => {
      localStorage.removeItem("user_email_forgot_password");
    };
  }, []);

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessage[type]);
  };

  const handleInputErrorMessagePassword = (type) => {
    return getFirstError(errorMessagePassword[type]);
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

  return (
    <div className="forgot-password">
      <ForgotPasswordWrapper>
        <LeftSideWording />

        <ForgotPasswordRightSection>
          <ForgotPasswordBox onKeyDown={handleChangePasswordWithEnter}>
            <InputTextGlobal
              value={email}
              onChange={(e) => handleOnChangeEmail(e.target.value)}
              inputPlaceholder={"Masukan Email"}
              inputErrorMessage={handleInputErrorMessage("email")}
              inputSecondErrorMessage={secondaryErrorObj.email}
              disabled={isEmailValidated}
            />

            {isEmailValidated && (
              <Fragment>
                <InputTextGlobal
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputPlaceholder={"New Password"}
                  inputType={"password"}
                  inputErrorMessage={handleInputErrorMessagePassword(
                    "password"
                  )}
                />

                <InputTextGlobal
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  inputPlaceholder={"New Password Confirmation"}
                  inputType={"password"}
                  inputErrorMessage={handleInputErrorMessagePassword(
                    "confirmPassword"
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
          </ForgotPasswordBox>
        </ForgotPasswordRightSection>
      </ForgotPasswordWrapper>
    </div>
  );
}
