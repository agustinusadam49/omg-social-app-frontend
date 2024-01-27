import React from "react";
import { Outlet, NavLink } from "react-router-dom";

import "./HostLayout.scss";

export default function HostLayout() {
  const activeStyles = {
    color: "mediumvioletred",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bolder",
  };

  const notActiveStyles = {
    color: "black",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bolder",
  };

  return (
    <div className="host-layout">
      <header className="host-layout-header">
        <nav className="host-layout-nav">
          <NavLink
            to="."
            end
            style={({ isActive }) =>
              isActive ? activeStyles : notActiveStyles
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="income"
            style={({ isActive }) =>
              isActive ? activeStyles : notActiveStyles
            }
          >
            Income
          </NavLink>

          <NavLink
            to="vans"
            style={({ isActive }) =>
              isActive ? activeStyles : notActiveStyles
            }
          >
            Vans
          </NavLink>

          <NavLink
            to="reviews"
            style={({ isActive }) =>
              isActive ? activeStyles : notActiveStyles
            }
          >
            Reviews
          </NavLink>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
