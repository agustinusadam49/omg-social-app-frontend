import React from "react";
import HomeTitle from "./home-title/HomeTitle";
import LoremParagraph from "./lorem-paragraph/LoremParagraph";
import CommentSimulation from "./show-case/comment-simulation/CommentSimulation";
import DynamicFieldsSimulation from "./show-case/dynamic-fields-simulation/DynamicFieldsSimulation";
import UserMentionedSimulation from "./show-case/user-mentioned-simulation/UserMentionedSimulation";

import "./Home.scss";

export default function Home() {
  return (
    <div className="main-vans-home">
      <HomeTitle />

      <LoremParagraph />

      <CommentSimulation />

      <DynamicFieldsSimulation />

      <UserMentionedSimulation />
    </div>
  );
}
