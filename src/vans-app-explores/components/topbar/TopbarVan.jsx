import React from "react";
import { NavLink, Link } from "react-router-dom";

import "./TopbarVan.scss";

export default function TopbarVan() {
  return (
    <header className="vans-app-main-header">
      <Link
        to="/"
        style={{
          textDecoration: "none",
          marginRight: "30px",
          color: "white",
        }}
      >
        #VanLife
      </Link>

      <nav className="vans-app-main-nav">
        <NavLink
          to="/about"
          style={{
            textDecoration: "none",
          }}
          className={({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          About
        </NavLink>

        <NavLink
          to="/host"
          style={{
            textDecoration: "none",
          }}
          className={({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          Host
        </NavLink>

        <NavLink
          to="/vans"
          style={{
            textDecoration: "none",
          }}
          className={({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          Vans
        </NavLink>
      </nav>
    </header>
  );
}
