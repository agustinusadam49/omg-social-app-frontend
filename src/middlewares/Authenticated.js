import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Authenticated = (props) => {
  let navigate = useNavigate();
  let {pathname: fullPathName} = useLocation()
  const isNeedAuth = props.needAuth;
  const isUserLoggedin = useSelector((state) => state.user.isUserAuthenticated);

  useEffect(() => {
    if (isNeedAuth) {
      if (!isUserLoggedin) {
        navigate({ pathname: "/login" });
      } else {
        navigate({pathname: fullPathName})
      }
    }
  }, [isUserLoggedin, isNeedAuth, fullPathName, navigate]);

  useEffect(() => {
    if (!isNeedAuth) {
      if (isUserLoggedin) {
        navigate({ pathname: "/" });
      }
    }
  }, [isUserLoggedin, isNeedAuth, navigate])

  return props.children;
};

export default Authenticated;
