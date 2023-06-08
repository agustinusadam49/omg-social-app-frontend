import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import "./ErrorMessageCaption.scss";

export default function ErrorMessageCaption({
  errorMessageEmptyCaption,
  setErrorMessageCaption,
}) {
  return (
    <div className="error-message-caption">
      <div className="error-message-wording">{errorMessageEmptyCaption}</div>

      <CancelIcon
        className="cancel-error-message"
        onClick={() => setErrorMessageCaption(false)}
      />
    </div>
  );
}
