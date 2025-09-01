import React from "react";

import OptionStatusWrapper from "./option-status-wrapper/OptionStatusWrapper";
import OptionStatusItem from "./option-status-item/OptionStatusItem";
import OptionStatusName from "./option-status-name/OptionStatusName";
import OptionStatusDescription from "./option-status-description/OptionStatusDescription";

import { REPOST_OPTION_TYPES, REPOST_OPTIONS_ENUM } from "./constant";

import { getStatus } from "./utils";

export default function RepostOptionStatus({ setActiveRepostType, activeRepostType }) {
  const toggleRepostType = (repostType) => {
    if (repostType === activeRepostType) return;
    setActiveRepostType(repostType);
  };

  return (
    <OptionStatusWrapper>
      {REPOST_OPTION_TYPES.map((status, index) => {
        const { name, description } = status;

        return (
          <OptionStatusItem
            key={index}
            isActive={activeRepostType === name}
            onClick={() => toggleRepostType(name)}
          >
            <OptionStatusName
              statusName={getStatus(name, REPOST_OPTIONS_ENUM)}
            />
            <OptionStatusDescription statusDescription={description} />
          </OptionStatusItem>
        );
      })}
    </OptionStatusWrapper>
  );
}
