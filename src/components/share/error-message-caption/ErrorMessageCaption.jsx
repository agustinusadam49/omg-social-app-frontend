import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import "./ErrorMessageCaption.scss";

export default function ErrorMessageCaption({
  errorMessage = null,
  handleCancelErrorMessage = null,
}) {
  const displayErrorMessage = () => {
    return errorMessage
      ? errorMessage
      : "Silahkan masukan caption terlebih dahulu!";
  };
  return (
    <div className="error-message-caption">
      <div className="error-message-caption-wording">
        {displayErrorMessage()}
      </div>

      <CancelIcon
        className="cancel-error-message"
        onClick={() => handleCancelErrorMessage()}
      />
    </div>
  );
}
