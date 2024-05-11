import { useState } from "react";
import { uploadImagePosting } from "../../apiCalls/postsApiFetch";

export const useUploadImagePostingHooks = ({ onSuccess, onError }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const appendKeyValues = (objectData) => {
    const formData = new FormData();

    const mappedObjArr = Object.keys(objectData).map((key) => ({
      key: key,
      value: objectData[key],
    }));

    for (let i = 0; i < mappedObjArr.length; i++) {
      const { key, value } = mappedObjArr[i];
      formData.append(key, value);
    }

    return formData;
  };

  const executeUploadImage = ({ formData, newPostBody }) => {
    uploadImagePosting(formData, {
      onUploadProgress: (progressEvent) => {
        setUploadProgress(
          Math.round((progressEvent.loaded / progressEvent.total) * 100)
        );
      },
    })
      .then((response) => {
        const isSuccessGetUrl = !!response.data.secure_url;
        if (isSuccessGetUrl) {
          onSuccess({ response, newPostBody });
          setUploadProgress(0);
        }
      })
      .catch((error) => {
        onError({ error });
        setUploadProgress(0);
      });
  };

  return {
    uploadProgress,
    executeUploadImage,
    appendKeyValues,
  };
};
