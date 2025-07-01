import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputTextGlobal from "../../../../../../components/input-text-global/InputTextGlobal";
import { useFormValidation } from "../../../../../../custom-hooks/useFormValidation";
import { setIsClicked } from "../../../../../../redux/slices/buttonsSlice";
import { setCommentSimulationCounterForId } from "../../../../../../redux/slices/commentsSlice";
import { useCommentChilderHooks } from "./useCommentChildrenHooks";

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

  const currentCounter = useSelector(
    ({ comments }) => comments.commentSimulationCounterForId
  );

  const { isValid: isChildrenCommentValid, handleInputErrorMessage } =
    useFormValidation({
      rulesSchema: {
        childrenComment: {
          currentValue: isAddChildren
            ? childrenComment
            : childrenCommentToUpdate,
          isRequired: true,
        },
      },
    });

  const { doRecursiveOps } = useCommentChilderHooks({
    setCommentList,
    commentItem,
    childrenCommentToUpdate,
    payloadToAdd: {
      id: `children-id-${childrenComment}-${currentCounter}`,
      commentText: childrenComment,
      isDeleted: false,
      children: [],
    },
  });

  const confirmAddChildrenComent = () => {
    dispatch(setIsClicked({ payload: true }));
    if (isChildrenCommentValid) {
      doRecursiveOps(crudTypeEnum.ADD);
      setChildrenComment("");
      dispatch(setCommentSimulationCounterForId({ value: 1 }));
      setIsAddChildren(false);
    }
  };

  const confirmUpdateChildrenComment = () => {
    dispatch(setIsClicked({ payload: true }));

    if (isChildrenCommentValid) {
      doRecursiveOps(crudTypeEnum.UPDATE);
      setIsUpdate(false);
    }
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
                setChildrenCommentToUpdate(commentItem.commentText);
              }}
            >
              {">"}
            </div>

            <div
              className="pluss-button update"
              onClick={() => {
                setIsUpdate((prevVal) => !prevVal);
                setIsAddChildren(false);
                setChildrenCommentToUpdate(commentItem.commentText);
              }}
            >
              {"U"}
            </div>

            <div
              className="pluss-button delete"
              onClick={() => {
                doRecursiveOps(crudTypeEnum.DELETE);
              }}
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
