import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import "./TopContent.scss";

export default function TopContent({ title, closeModalEdit }) {
  return (
    <div className="top-content">
      <div className="edit-profile-modal-content">{title}</div>

      <CancelIcon
        className="modal-close-button"
        onClick={closeModalEdit}
      />
    </div>
  );
}
