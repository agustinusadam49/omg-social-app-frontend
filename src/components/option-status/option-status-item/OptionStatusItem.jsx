import React from "react";
import "./OptionStatusItem.scss";

export default function OptionStatusItem({
  isActive,
  additionalClasses,
  ...props
}) {
  const { children } = props;

  const formattedClass = (classesArr) => {
    return classesArr.join(" ");
  };

  const mergedAllClasses = () => {
    let baseClass = [`option-status-item ${isActive ? "active" : ""}`];

    if (additionalClasses && !!additionalClasses.length) {
      const formattedStyles = formattedClass(additionalClasses);
      baseClass.push(formattedStyles);
    }

    const formattedBaseClass = formattedClass(baseClass);
    return formattedBaseClass;
  };

  return (
    <div
      className={mergedAllClasses()}
      {...props}
    >
      {children || null}
    </div>
  );
}
