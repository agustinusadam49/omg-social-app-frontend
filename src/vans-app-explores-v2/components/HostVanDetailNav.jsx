import { NavLink, useParams } from "react-router-dom";

export default function HostVanDetailNav() {
  const { hostVanId } = useParams();
  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#bcc21d",
  };

  const getActiveStyles = (active) => {
    return active ? activeStyle : null;
  };

  return (
    <nav className="host-van-detail-nav">
      <NavLink
        to={`/host/vans/${hostVanId}`}
        end
        style={({ isActive }) => getActiveStyles(isActive)}
      >
        Details
      </NavLink>
      <NavLink
        to={`/host/vans/${hostVanId}/pricing`}
        style={({ isActive }) => getActiveStyles(isActive)}
      >
        Pricing
      </NavLink>
      <NavLink
        to={`/host/vans/${hostVanId}/photos`}
        style={({ isActive }) => getActiveStyles(isActive)}
      >
        Photos
      </NavLink>
    </nav>
  );
}
