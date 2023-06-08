import React from "react";
import { Link } from "react-router-dom";

import "./GlobalImage.scss";

export default function GlobalImage({
  widthSize,
  heighSize,
  imageName,
  imageSource,
  additionalClassName,
  isRoundImg,
  pathLink = null,
}) {
  const additionalClass = () => {
    if (additionalClassName.length) return additionalClassName.join(" ");
    return "";
  };

  const checkIsRound = () => {
    if (isRoundImg) return "round-image";
    return "";
  };

  const displayImageWithCheckingType = () => {
    if (pathLink) {
      return (
        <Link
          to={pathLink}
          className={`global-image ${additionalClass()} ${checkIsRound}`}
          style={{ width: `${widthSize}px`, height: `${heighSize}px` }}
        >
          <img
            src={imageSource}
            alt={imageName}
            className={`global-real-image-tag ${
              isRoundImg ? "round-image" : ""
            }`}
          />
        </Link>
      );
    }

    return (
      <div
        className={`global-image ${additionalClass()} ${checkIsRound}`}
        style={{ width: `${widthSize}px`, height: `${heighSize}px` }}
      >
        <img
          src={imageSource}
          alt={imageName}
          className={`global-real-image-tag ${isRoundImg ? "round-image" : ""}`}
        />
      </div>
    );
  };

  const renderImage = displayImageWithCheckingType()
  return renderImage
}
