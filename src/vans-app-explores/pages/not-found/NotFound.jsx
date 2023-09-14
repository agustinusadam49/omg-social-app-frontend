import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.scss";

export default function NotFound() {
  return (
    <div className="not-found">
      <h2 className="wording">Sorry, the page you were looking for was not found.</h2>

      <Link
        to="/"
        style={{
          textDecoration: "none",
        }}
        className="return-to-home"
      >
        Return To Home
      </Link>
    </div>
  );
}
