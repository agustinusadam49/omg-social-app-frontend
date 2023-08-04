import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";

import "./HostLayout.scss";

export default function HostLayout() {
  const location = useLocation();
  const { pathname } = location;
  const currentPathname = pathname;
  return (
    <div className="host-layout">
      <header className="host-layout-header">
        <nav className="host-layout-nav">
          <Link
            to="/host"
            style={{
              textDecoration: "none",
              color: currentPathname === "/host" ? "mediumvioletred" : "black",
              fontSize: "13px",
              fontWeight: "bolder",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/host/income"
            style={{
              textDecoration: "none",
              color: currentPathname === "/host/income" ? "mediumvioletred" : "black",
              fontSize: "13px",
              fontWeight: "bolder",
            }}
          >
            Income
          </Link>

          <Link
            to="/host/reviews"
            style={{
              textDecoration: "none",
              color: currentPathname === "/host/reviews" ? "mediumvioletred" : "black",
              fontSize: "13px",
              fontWeight: "bolder",
            }}
          >
            Reviews
          </Link>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
