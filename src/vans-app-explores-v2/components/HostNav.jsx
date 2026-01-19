import { NavLink } from "react-router-dom";

export default function HostNav() {
  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#20841e",
  };

  const getStyleNavlink = (isNavActive) => {
    return isNavActive ? activeStyle : null;
  };

  return (
    <nav className="host-nav">
      <NavLink
        to="/host"
        style={({ isActive }) => getStyleNavlink(isActive)}
        end
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/host/income"
        style={({ isActive }) => getStyleNavlink(isActive)}
      >
        Income
      </NavLink>
      <NavLink
        to="/host/vans"
        style={({ isActive }) => getStyleNavlink(isActive)}
      >
        Vans
      </NavLink>
      <NavLink
        to="/host/reviews"
        style={({ isActive }) => getStyleNavlink(isActive)}
      >
        Reviews
      </NavLink>
    </nav>
  );
}
