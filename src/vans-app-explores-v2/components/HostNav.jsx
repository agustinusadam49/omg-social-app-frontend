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
        to="/host-v2"
        style={({ isActive }) => getStyleNavlink(isActive)}
        end
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/host-v2/income"
        style={({ isActive }) => getStyleNavlink(isActive)}
      >
        Income
      </NavLink>
      <NavLink
        to="/host-v2/vans"
        style={({ isActive }) => getStyleNavlink(isActive)}
      >
        Vans
      </NavLink>
      <NavLink
        to="/host-v2/reviews"
        style={({ isActive }) => getStyleNavlink(isActive)}
      >
        Reviews
      </NavLink>
    </nav>
  );
}
