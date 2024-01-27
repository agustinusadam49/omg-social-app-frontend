import React from "react";
import { useRouteError } from "react-router-dom";

import "./Error.scss";

export default function Error() {
  const error = useRouteError();

  return (
    <div className="error-content">
      <h2>Error: {error.message || "There was an error!"}</h2>
      <pre>
        {error.code} - {error.statusText}
      </pre>
    </div>
  );
}
