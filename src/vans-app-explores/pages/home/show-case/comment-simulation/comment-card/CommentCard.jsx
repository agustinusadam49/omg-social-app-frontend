import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import InputTextGlobal from "../../../../../../components/input-text-global/InputTextGlobal";
import { useFormValidation } from "../../../../../../custom-hooks/useFormValidation";
import { getFirstError } from "../../../../../../utils/formValidationFunction";
import { setIsClicked } from "../../../../../../redux/slices/buttonsSlice";

import "./CommentCard.scss";

const crudTypeEnum = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export default function CommentCard({ commentItem, setCommentList }) {
  const dispatch = useDispatch();
  const isChildren = useMemo(() => !!commentItem.children, [commentItem]);

  const [isAddChildren, setIsAddChildren] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [childrenComment, setChildrenComment] = useState("");
  const [childrenCommentToUpdate, setChildrenCommentToUpdate] = useState(
    commentItem.commentText
  );

  const childrenCommentRulesSchema = useMemo(
    () => ({
      childrenComment: {
        currentValue: isAddChildren ? childrenComment : childrenCommentToUpdate,
        isRequired: true,
      },
    }),
    [childrenComment, childrenCommentToUpdate, isAddChildren]
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
        isDeleted: false,
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

  const confirmUpdateChildrenComment = () => {
    dispatch(setIsClicked({ payload: true }));
    if (isChildrenCommentValid) {
      const updateItemRecursively = (itemOfCommentList) => {
        if (itemOfCommentList.commentText === commentItem.commentText) {
          itemOfCommentList.commentText = childrenCommentToUpdate;
        }

        if (itemOfCommentList.children.length) {
          for (let i = 0; i < itemOfCommentList.children.length; i++) {
            updateItemRecursively(itemOfCommentList.children[i]);
          }
        }
      };

      const doGetCommentItem = (prevVal) => {
        for (let i = 0; i < prevVal.length; i++) {
          updateItemRecursively(prevVal[i]);
        }

        return [...prevVal];
      };

      setCommentList((prevVal) => {
        return doGetCommentItem(prevVal);
      });
      setIsUpdate(false);
    }
  };

  const deleteChildrenComment = () => {
    const deleteItemRecursively = (itemOfCommentList) => {
      if (itemOfCommentList.commentText === commentItem.commentText) {
        itemOfCommentList.isDeleted = true;
      }

      if (itemOfCommentList.children.length) {
        for (let i = 0; i < itemOfCommentList.children.length; i++) {
          deleteItemRecursively(itemOfCommentList.children[i]);
        }
      }
    };

    const doGetCommentItem = (prevVal) => {
      for (let i = 0; i < prevVal.length; i++) {
        deleteItemRecursively(prevVal[i]);
      }

      return [...prevVal];
    };

    setCommentList((prevVal) => {
      return doGetCommentItem(prevVal);
    });
  };

  const doCrudChildrenComment = (event, crudType) => {
    const isEnterButton = event.keyCode === 13;

    if (isEnterButton && crudType === crudTypeEnum.ADD) {
      confirmAddChildrenComent();
    }

    if (isEnterButton && crudType === crudTypeEnum.UPDATE) {
      confirmUpdateChildrenComment();
    }
  };

  return (
    <div
      className={`card-component-wrapper ${
        commentItem.children.length ? "is-children" : ""
      }`}
    >
      <div className="comment-card">
        <div className="comment-card-top-section">
          <div className="comment-text">{commentItem.commentText}</div>

          <div className="button-icon-wrapper">
            <div
              className="pluss-button"
              onClick={() => {
                setIsAddChildren((prevVal) => !prevVal);
                setIsUpdate(false);
                setChildrenCommentToUpdate(commentItem.commentText)
              }}
            >
              {">"}
            </div>

            <div
              className="pluss-button update"
              onClick={() => {
                setIsUpdate((prevVal) => !prevVal);
                setIsAddChildren(false);
                setChildrenCommentToUpdate(commentItem.commentText)
              }}
            >
              {"U"}
            </div>

            <div
              className="pluss-button delete"
              onClick={deleteChildrenComment}
            >
              {"D"}
            </div>
          </div>
        </div>

        {isAddChildren && (
          <div
            className="comment-card-bottom-section"
            onKeyDown={(event) =>
              doCrudChildrenComment(event, crudTypeEnum.ADD)
            }
          >
            <InputTextGlobal
              value={childrenComment}
              onChange={(e) => setChildrenComment(e.target.value)}
              inputPlaceholder="Input your comment here ..."
              inputErrorMessage={handleInputErrorMessage("childrenComment")}
            />
          </div>
        )}

        {isUpdate && (
          <div
            className="comment-card-bottom-section"
            onKeyDown={(event) =>
              doCrudChildrenComment(event, crudTypeEnum.UPDATE)
            }
          >
            <InputTextGlobal
              value={childrenCommentToUpdate}
              onChange={(e) => setChildrenCommentToUpdate(e.target.value)}
              inputPlaceholder="Input your comment update here ..."
              inputErrorMessage={handleInputErrorMessage("childrenComment")}
            />
          </div>
        )}
      </div>

      <div className="comment-card-wrapper-children">
        {isChildren &&
          commentItem.children
            .filter((item) => !item.isDeleted)
            .map((comment, commentIdx) => (
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
