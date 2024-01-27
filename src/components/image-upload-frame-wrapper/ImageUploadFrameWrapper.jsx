import React from "react";

export default function ImageUploadFrameWrapper({
  children,
  additionalStyle = {},
}) {
  return (
    <div
      style={{
        border: "2px dashed grey",
        padding: 12,
        borderRadius: 8,
        ...additionalStyle,
      }}
    >
      {children}
    </div>
  );
}
