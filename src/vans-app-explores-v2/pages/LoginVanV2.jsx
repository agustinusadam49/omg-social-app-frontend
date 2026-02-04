import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import { helpersWithMessage } from "../../utils/formValidationFunction";
import { useDispatch } from "react-redux";
import { setIsClicked } from "../../redux/slices/buttonsSlice";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../components/button/GlobalButton";

export default function LoginVanV2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();

  const loginMessage = searchParams.get("message");

  const { isValid, handleInputErrorMessage } = useFormValidation({
    rulesSchema: {
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
          "password tidak boleh ada spasi",
          password,
          (val) => {
            const passwordValue = val;
            return !passwordValue.includes(" ");
          },
        ),
      },
    },
  });

  const doLogin = () => {
    dispatch(setIsClicked({ payload: true }));
    if (isValid) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      setEmail("");
      setPassword("");

      const from = location?.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  };

  return (
    <div>
      <h1>Sign in to your account</h1>

      {loginMessage ? <h4>{loginMessage}</h4> : null}

      <InputTextGlobal
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        inputPlaceholder={"Email"}
        inputErrorMessage={handleInputErrorMessage("email")}
      />

      <InputTextGlobal
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        inputPlaceholder={"Password"}
        inputType="password"
        inputErrorMessage={handleInputErrorMessage("password")}
      />

      <GlobalButton buttonLabel="Sign In" onClick={doLogin} />
    </div>
  );
}
