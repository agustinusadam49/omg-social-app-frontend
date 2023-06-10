import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import "./ErrorMessageCaption.scss";

export default function ErrorMessageCaption({ handleCancelErrorMessage }) {
  return (
    <div className="error-message-caption">
      <div className="error-message-caption-wording">
        Silahkan masukan caption terlebih dahulu!
      </div>

      <CancelIcon
        className="cancel-error-message"
        onClick={() => handleCancelErrorMessage(false)}
      />
    </div>
  );
}
