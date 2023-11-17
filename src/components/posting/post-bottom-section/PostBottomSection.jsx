import React from "react";

import "./PostBottomSection.scss";

export default function PostBottomSection({ leftContent, rightContent }) {
  const renderFunctionProp = (reactNode) => {
    return typeof reactNode === "function" ? reactNode() : reactNode;
  };

  return (
    <div className="post-bottom">
      <div className="post-bottom-left">{renderFunctionProp(leftContent)}</div>

      <div className="post-bottom-right">
        {renderFunctionProp(rightContent)}
      </div>
    </div>
  );
}
