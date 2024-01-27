import React from "react";

import "./EditProfileModalWrapper.scss";

export default function EditProfileModalWrapper({ children }) {
  return (
    <div className="content-container edit-profile-and-avatar-modal">
      <div className="modal-content-wrapper">{children}</div>
    </div>
  );
}
