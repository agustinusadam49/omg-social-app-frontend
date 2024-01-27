import React from "react";

import "./ForgotPasswordBox.scss";

export default function ForgotPasswordBox({ children, ...otherProps }) {
  return (
    <div className="forgot-password-box" {...otherProps}>
      {children}
    </div>
  );
}
