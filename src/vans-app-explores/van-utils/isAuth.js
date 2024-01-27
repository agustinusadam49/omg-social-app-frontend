export const isAuth = () => {
  const isEmail = localStorage.getItem("email");
  const isPassword = localStorage.getItem("password");
  return !!isEmail && !!isPassword;
};
