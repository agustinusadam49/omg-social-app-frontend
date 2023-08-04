import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./TopbarVan.scss";

export default function TopbarVan() {
  const location = useLocation();
  const { pathname } = location;
  const currentPathname = pathname;

  return (
    <header className="vans-app-main-header">
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: currentPathname === "/" ? "yellow" : "white",
          marginRight: "30px",
        }}
      >
        #VanLife
      </Link>

      <nav className="vans-app-main-nav">
        <Link
          to="/about"
          style={{
            textDecoration: "none",
            color: currentPathname === "/about" ? "yellow" : "white",
          }}
        >
          About
        </Link>

        <Link
          to="/host"
          style={{
            textDecoration: "none",
            color: currentPathname === "/host" ? "yellow" : "white",
          }}
        >
          Host
        </Link>

        <Link
          to="/vans"
          style={{
            textDecoration: "none",
            color: currentPathname === "/vans" ? "yellow" : "white",
          }}
        >
          Vans
        </Link>
      </nav>
    </header>
  );
}
