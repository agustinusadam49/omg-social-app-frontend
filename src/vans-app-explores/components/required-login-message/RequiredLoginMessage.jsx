import React from "react";

import "./RequiredLoginMessage.scss"

export default function RequiredLoginMessage({message}) {
  return <div className="required-login-message">{message}</div>
}
