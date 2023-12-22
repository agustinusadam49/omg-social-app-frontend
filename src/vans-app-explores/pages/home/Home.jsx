import React from "react";
import CommentSimulation from "./show-case/comment-simulation/CommentSimulation";
import DynamicFieldsSimulation from "./show-case/dynamic-fields-simulation/DynamicFieldsSimulation";
import UserMentionedSimulation from "./show-case/user-mentioned-simulation/UserMentionedSimulation";

import "./Home.scss";

export default function Home() {
  return (
    <div className="main-vans-home">
      <div className="main-vans-home-title">
        This is a HOME page of VANS web app
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        perferendis aspernatur sit necessitatibus quia cumque ratione
        praesentium perspiciatis quaerat obcaecati nesciunt dicta saepe, fugiat
        unde. Corporis in ullam quo quas.
      </p>

      <CommentSimulation />

      <DynamicFieldsSimulation />

      <UserMentionedSimulation />
    </div>
  );
}
