import React from "react";

import "./PostContainer.scss"

export default function PostContainer({ children }) {
  return <div className="post">{children}</div>;
}
