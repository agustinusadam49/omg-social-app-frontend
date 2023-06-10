import React, { useMemo, memo, useCallback } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

import "./SharePreviewImageSection.scss";

const SharePreviewImageSection = ({
  fileImagePosting,
  cancelImagePreviewHandler,
}) => {
  const previewImageUrl = useMemo(
    () => URL.createObjectURL(fileImagePosting),
    [fileImagePosting]
  );

  const handleCancelImagePreview = useCallback(() => {
    cancelImagePreviewHandler();
  }, [cancelImagePreviewHandler]);

  return (
    <div className="preview-img-container">
      <img src={previewImageUrl} alt="preview-img" className="preview-img" />

      <CancelIcon
        className="cancel-preview-img"
        onClick={handleCancelImagePreview}
      />
    </div>
  );
};

export default memo(SharePreviewImageSection)
