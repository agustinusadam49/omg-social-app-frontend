import { useState } from "react";
import { useNavigate, useLoaderData, redirect } from "react-router-dom";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import { helpersWithMessage } from "../../utils/formValidationFunction";
import { useDispatch } from "react-redux";
import { setIsClicked } from "../../redux/slices/buttonsSlice";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../components/button/GlobalButton";

export default function LoginVanV2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { requiredLoginMessage, fromPastPath } = useLoaderData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      navigate(fromPastPath || "/", { replace: true });
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        Sign in to your account
      </h1>

      {requiredLoginMessage && (
        <h4 style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {requiredLoginMessage}
        </h4>
      )}

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

      <GlobalButton
        buttonLabel="Sign In"
        onClick={doLogin}
        classStyleName="login-button-van-app-v2"
      />
    </div>
  );
}

export const loginVanLoaderV2 = async ({ request }) => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const isAuth = !!email && !!password;
  if (isAuth) {
    throw redirect("/");
  }

  const messageQuery = new URL(request.url).searchParams.get("message");
  const fromQuery = new URL(request.url).searchParams.get("from");

  return { requiredLoginMessage: messageQuery, fromPastPath: fromQuery };
};
