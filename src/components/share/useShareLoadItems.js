import { useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPostLoadItems } from "../../redux/slices/postsSlice";

export const useShareLoadItems = ({
  inputCaption,
  inputFileImage,
  inputShareState,
  title,
}) => {
  const dispatch = useDispatch();

  const loadItems = useMemo(() => {
    return [
      {
        title: title._1,
        pendingStatus: inputShareState.uploadPostPending,
        loadingStatus: inputShareState.uploadPostLoading,
        successStatus: inputShareState.isUploadPostSuccess,
        isNotSkip: !!inputCaption,
      },
      {
        title: title._2,
        pendingStatus: inputShareState.uploadImagePending,
        loadingStatus: inputShareState.uploadImageLoading,
        successStatus: inputShareState.isUploadImageSuccess,
        isNotSkip: !!inputFileImage,
      },
    ];
  }, [
    title,
    inputCaption,
    inputFileImage,
    inputShareState.uploadPostPending,
    inputShareState.uploadPostLoading,
    inputShareState.isUploadPostSuccess,
    inputShareState.uploadImagePending,
    inputShareState.uploadImageLoading,
    inputShareState.isUploadImageSuccess,
  ]);

  useEffect(() => {
    const filteredLoadItems = loadItems
      .filter((item) => item.isNotSkip)
      .sort((a, b) => b.loadingStatus - a.loadingStatus);
    dispatch(setPostLoadItems({ payload: filteredLoadItems }));
  }, [loadItems, dispatch]);
};
