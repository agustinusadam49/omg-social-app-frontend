import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import "./FinishPostingStatus.scss";

export default function FinishPostingStatus({ setFinishPostingStatus }) {
  return (
    <div className="success-message-container">
      <div className="success-message-wording">SUCCESS POSTING!</div>

      <CancelIcon
        className="cancel-success-message"
        onClick={() => setFinishPostingStatus(false)}
      />
    </div>
  );
}
