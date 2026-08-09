import { NavLink, Link, useNavigate } from "react-router-dom";
import { checkUserLogin } from "../utils/index";

export default function Header() {
  const navigate = useNavigate();
  const isAuth = checkUserLogin();
  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#b95151",
  };

  const doLogout = () => {
    localStorage.clear();
    navigate("/login-van-v2");
  };

  return (
    <header>
      <Link className="site-logo" to="/">
        #VANLIFE
      </Link>
      <nav>
        <NavLink
          to="/vans-v2"
          style={({ isActive }) => (isActive ? activeStyle : null)}
        >
          Vans
        </NavLink>
        <NavLink
          to="/host-v2"
          style={({ isActive }) => (isActive ? activeStyle : null)}
        >
          Host
        </NavLink>
        <NavLink
          to="/about-v2"
          style={({ isActive }) => (isActive ? activeStyle : null)}
        >
          About
        </NavLink>
        {!isAuth ? (
          <NavLink
            to="/login-van-v2"
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            Login
          </NavLink>
        ) : (
          <div className="logout-button-van-v2" onClick={() => doLogout()}>
            Logout
          </div>
        )}
      </nav>
    </header>
  );
}
