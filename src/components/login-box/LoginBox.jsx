import React from "react";

import "./LoginBox.scss";

export default function LoginBox({ children, ...otherProps }) {
  return (
    <div className="login-box" {...otherProps}>
      {children}
    </div>
  );
}
