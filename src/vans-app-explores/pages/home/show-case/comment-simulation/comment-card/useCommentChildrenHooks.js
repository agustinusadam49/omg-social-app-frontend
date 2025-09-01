export const useCommentChilderHooks = ({
  setCommentList,
  commentItem,
  childrenCommentToUpdate,
  payloadToAdd,
}) => {
  const crudTypeEnum = {
    ADD: "ADD",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
  };

  const doRecursiveOps = (operationType) => {
    const doOperationRecursively = (itemOfCommentList) => {
      if (itemOfCommentList.id === commentItem.id) {
        if (operationType === crudTypeEnum.ADD) {
          itemOfCommentList.children.push(payloadToAdd);
        }

        if (operationType === crudTypeEnum.UPDATE) {
          itemOfCommentList.commentText = childrenCommentToUpdate;
        }

        if (operationType === crudTypeEnum.DELETE) {
          itemOfCommentList.isDeleted = true;
        }
      }

      if (itemOfCommentList.children.length) {
        for (let i = 0; i < itemOfCommentList.children.length; i++) {
          doOperationRecursively(itemOfCommentList.children[i]);
        }
      }
    };

    const checkCommentItem = (prevVal) => {
      for (let i = 0; i < prevVal.length; i++) {
        doOperationRecursively(prevVal[i]);
      }

      return [...prevVal];
    };

    setCommentList((prevVal) => {
      return checkCommentItem(prevVal);
    });
  };

  return {
    doRecursiveOps,
  };
};
