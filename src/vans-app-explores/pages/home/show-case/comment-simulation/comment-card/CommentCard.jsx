import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import InputTextGlobal from "../../../../../../components/input-text-global/InputTextGlobal";
import { useFormValidation } from "../../../../../../custom-hooks/useFormValidation";
import { getFirstError } from "../../../../../../utils/formValidationFunction";
import { setIsClicked } from "../../../../../../redux/slices/buttonsSlice";

import "./CommentCard.scss"

export default function CommentCard({ commentItem, setCommentList }) {
  const dispatch = useDispatch();
  const isChildren = useMemo(() => !!commentItem.children, [commentItem]);

  const [isAddChildren, setIsAddChildren] = useState(false);
  const [childrenComment, setChildrenComment] = useState("");

  const childrenCommentRulesSchema = useMemo(
    () => ({
      childrenComment: {
        currentValue: childrenComment,
        isRequired: true,
      },
    }),
    [childrenComment]
  );

  const {
    isValid: isChildrenCommentValid,
    errorMessage: errorMessageChildrenComment,
  } = useFormValidation({
    rulesSchema: childrenCommentRulesSchema,
  });

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessageChildrenComment[type]);
  };

  const confirmAddChildrenComent = () => {
    dispatch(setIsClicked({ payload: true }));
    if (isChildrenCommentValid) {
      const payload = {
        commentText: childrenComment,
        children: [],
      };

      const addItemRecursively = (itemOfCommentList) => {
        let readyContent = {
          ...itemOfCommentList,
        };

        if (itemOfCommentList.commentText === commentItem.commentText) {
          readyContent.children.push(payload);
        }

        if (itemOfCommentList.children.length) {
          for (let i = 0; i < itemOfCommentList.children.length; i++) {
            addItemRecursively(itemOfCommentList.children[i]);
          }
        }
      };

      const doAddCommentItem = (prevVal) => {
        for (let i = 0; i < prevVal.length; i++) {
          addItemRecursively(prevVal[i]);
        }

        return [...prevVal];
      };

      setCommentList((prevVal) => {
        return doAddCommentItem(prevVal);
      });
      setChildrenComment("");
      setIsAddChildren(false);
    }
  };

  const doAddChildrenComment = (event) => {
    const isEnterButton = event.keyCode === 13;

    if (isEnterButton) {
      confirmAddChildrenComent();
    }
  };

  return (
    <div className={`card-component-wrapper ${commentItem.children.length ? "is-children" : ""}`}>
      <div className="comment-card">
        <div className="comment-card-top-section">
          <div className="comment-text">{commentItem.commentText}</div>
          <div
            className="pluss-button"
            onClick={() => setIsAddChildren((prevVal) => !prevVal)}
          >
            {">"}
          </div>
        </div>

        {isAddChildren && (
          <div
            className="comment-card-bottom-section"
            onKeyDown={doAddChildrenComment}
          >
            <InputTextGlobal
              value={childrenComment}
              onChange={(e) => setChildrenComment(e.target.value)}
              inputPlaceholder="Input your comment here ..."
              inputErrorMessage={handleInputErrorMessage("childrenComment")}
            />
          </div>
        )}
      </div>

      <div className="comment-card-wrapper-children">
        {isChildren &&
          commentItem.children.map((comment, commentIdx) => (
            <CommentCard
              key={`comment-item-key-${commentIdx}`}
              className="comment-card"
              commentItem={comment}
              setCommentList={setCommentList}
            />
          ))}
      </div>
    </div>
  );
}
