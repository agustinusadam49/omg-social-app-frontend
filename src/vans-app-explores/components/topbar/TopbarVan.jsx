import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../van-utils/isAuth";

import "./TopbarVan.scss";

export default function TopbarVan() {
  const isUserAuth = isAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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

        {!isUserAuth ? (
          <NavLink
            to="/login"
            style={{
              textDecoration: "none",
            }}
            className={({ isActive }) =>
              isActive ? "active-link" : "not-active-link"
            }
          >
            Login
          </NavLink>
        ) : (
          <div className="logout-button" onClick={doLogout}>
            Logout
          </div>
        )}
      </nav>
    </header>
  );
}
