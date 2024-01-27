import React from "react";

import "./RegisterBox.scss";

export default function RegisterBox({ children, ...otherProps }) {
  return (
    <div className="register-box" {...otherProps}>
      {children}
    </div>
  );
}
