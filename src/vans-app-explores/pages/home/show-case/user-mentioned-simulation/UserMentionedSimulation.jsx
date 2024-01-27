import React, { useState, useEffect, useMemo } from "react";
import InputTextGlobal from "../../../../../components/input-text-global/InputTextGlobal";

import "./UserMentionedSimulation.scss";

const userDummyOptions = [
  {
    text: "Adam Wijaya",
    value: "AdamWijaya",
  },
  {
    text: "Fahmi Hassan",
    value: "TheFahmiHassan",
  },
  {
    text: "Wisman Nur",
    value: "WismanNur231",
  },
  {
    text: "Rachmat Ridwan",
    value: "RRidwan",
  },
];

export default function UserMentionedSimulation() {
  const [currentOption, setCurrentOption] = useState("");

  const getUserDummyItem = (index) => {
    const choseUserItem = userDummyOptions.find((_user, idx) => idx === index);
    setCurrentOption(choseUserItem.value);
  };

  const [caption, setCaption] = useState("");

  const showMentionedOptions = useMemo(() => {
    return caption[caption.length - 1] === "@";
  }, [caption]);

  useEffect(() => {
    if (currentOption) {
      setCaption((prevVal) => (prevVal += `${currentOption} `));
    }
  }, [currentOption]);

  return (
    <div className="get-mentioned-wrapper">
      <div className="get-mentioned-title">User Mentioned Simulation</div>
      {showMentionedOptions && (
        <div className="get-mentioned-box">
          {userDummyOptions.map((user, userIdx) => (
            <div
              key={userIdx}
              className="user-mentioned-item"
              onClick={() => getUserDummyItem(userIdx)}
            >
              {user.text}
            </div>
          ))}
        </div>
      )}

      <InputTextGlobal
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
    </div>
  );
}
