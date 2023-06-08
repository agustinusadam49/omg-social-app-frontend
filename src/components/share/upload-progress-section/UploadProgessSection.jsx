import React from "react";
import "./UploadProgessSection.scss";

export default function UploadProgessSection({uploadProgress}) {
  return (
    <div className="uploading-progress-container">
      <div className="progress-upload-presentage">{uploadProgress} %</div>
      <div className="uploading-wording">Uploading Image</div>
    </div>
  );
}
