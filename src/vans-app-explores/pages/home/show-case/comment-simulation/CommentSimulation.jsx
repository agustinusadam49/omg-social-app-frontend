import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getFirstError } from "../../../../../utils/formValidationFunction";
import { useFormValidation } from "../../../../../custom-hooks/useFormValidation";
import { setIsClicked } from "../../../../../redux/slices/buttonsSlice";
import InputTextGlobal from "../../../../../components/input-text-global/InputTextGlobal";
import CommentCard from "./comment-card/CommentCard";

import "./CommentSimulation.scss";

export default function CommentSimulation() {
  const dispatch = useDispatch();
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");

  const commentRulesSchema = useMemo(
    () => ({
      comment: {
        currentValue: comment,
        isRequired: true,
      },
    }),
    [comment]
  );

  const { isValid: isCommentValid, errorMessage: errorMessageComment } =
    useFormValidation({
      rulesSchema: commentRulesSchema,
    });

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessageComment[type]);
  };

  const confirmAddComent = () => {
    dispatch(setIsClicked({ payload: true }));
    if (isCommentValid) {
      const payload = {
        commentText: comment,
        isDeleted: false,
        children: [],
      };

      setCommentList((prevVal) => [...prevVal, payload]);
      setComment("");
    }
  };

  const doAddComment = (event) => {
    const isEnterButton = event.keyCode === 13;

    if (isEnterButton) {
      confirmAddComent();
    }
  };

  return (
    <div className="comment-parent-wrapper" onKeyDown={doAddComment}>
      <div className="comment-title">Comment Feature Simulation</div>
      {!!commentList.length && (
        <>
          {commentList
            .filter((item) => !item.isDeleted)
            .map((comment, commentIdx) => (
              <CommentCard
                key={`comment-item-key-${commentIdx}`}
                className="comment-card"
                commentItem={comment}
                setCommentList={setCommentList}
              />
            ))}
        </>
      )}

      <InputTextGlobal
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        inputPlaceholder="Input your comment here ..."
        inputErrorMessage={handleInputErrorMessage("comment")}
      />
    </div>
  );
}
