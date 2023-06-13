import React, { Fragment } from "react";
import "./RadioGroupGlobal.scss";

function RadioGroupGlobal({ mainValue, setInputValue, radioItems }) {
  return (
    <div className="radio-group-global-styles">
      {radioItems.map((item) => {
        const { label, value } = item;
        return (
          <Fragment>
            <div className="label-and-input-wrapper">
              <label className="radio-group-label">{label}</label>
              <input
                type="radio"
                value={value}
                checked={mainValue === value}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default RadioGroupGlobal;
