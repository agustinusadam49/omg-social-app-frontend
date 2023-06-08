import React, { useMemo } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import "./SharePreviewImageSection.scss";

export default function SharePreviewImageSection({
  fileImagePosting,
  cancelImagePreviewHandler,
}) {
  const previewImageUrl = useMemo(
    () => URL.createObjectURL(fileImagePosting),
    [fileImagePosting]
  );

  const handleCancelImagePreview = () => {
    cancelImagePreviewHandler();
  };

  return (
    <div className="preview-img-container">
      <img src={previewImageUrl} alt="preview-img" className="preview-img" />

      <CancelIcon
        className="cancel-preview-img"
        onClick={handleCancelImagePreview}
      />
    </div>
  );
}
