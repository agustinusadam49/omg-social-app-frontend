export const useShareCommonHooks = ({
  setCaption,
  setFileImagePosting,
  onCancelImagePreviewHandler,
  onRunPostPendingThenStopIt,
  onRunImagePendingThenLoading,
}) => {
  const handleSetCaptionOnParent = (val) => {
    setCaption(val);
  };

  const addFileImagePosting = (file) => {
    setFileImagePosting(file);
  };

  const cancelImagePreviewHandler = () => {
    onCancelImagePreviewHandler();
  };

  const runPostPendingThenStopIt = async () => {
    onRunPostPendingThenStopIt();
  };

  const runImagePendingThenLoading = async () => {
    onRunImagePendingThenLoading()
  };

  return {
    handleSetCaptionOnParent,
    addFileImagePosting,
    cancelImagePreviewHandler,
    runPostPendingThenStopIt,
    runImagePendingThenLoading,
  };
};
