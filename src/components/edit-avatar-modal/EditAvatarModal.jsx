import React, { Fragment, useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import GlobalButton from "../button/GlobalButton";
import { uploadImagePosting } from "../../apiCalls/postsApiFetch";
import { updateProfileById } from "../../apiCalls/profileApiFetch";
import EditProfileModalWrapper from "../edit-profile-modal-wrapper/EditProfileModalWrapper";
import TopContent from "../edit-profile-modal-wrapper/top-content/TopContent";
import MiddleContent from "../edit-profile-modal-wrapper/middle-content/MiddleContent";
import BottomContent from "../edit-profile-modal-wrapper/bottom-content/BottomContent";
import ImageUploadFrameWrapper from "../image-upload-frame-wrapper/ImageUploadFrameWrapper";

import "./EditAvatarModal.scss";

export default function EditAvatarModal({
  closeModalEditProfile,
  userProfileData,
  doSnapForEditProfile,
}) {
  const profileId = userProfileData.id;
  const avatarUrl = userProfileData.avatarUrl;
  const profileCover = userProfileData.profileCoverUrl;

  const [avatarUrlFile, setAvatarUrlFile] = useState(null);
  const [profileCoverFile, setProfileCoverFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressProfile, setUploadProgressProfile] = useState(0);

  const avatarRef = useRef(null);
  const coverImageRef = useRef(null);

  const uploadAvatar = () => {
    avatarRef.current.click();
  };

  const uploadCoverImage = () => {
    coverImageRef.current.click();
  };

  const closeModalEdit = (statusValue) => {
    closeModalEditProfile(statusValue);
  };

  const cancelAvatarPreviewHandler = () => {
    let avatar = document.getElementById("file-avatar");
    avatar.value = "";
    setAvatarUrlFile(null);
  };

  const cancelProfilePreviewHandler = () => {
    let profileCover = document.getElementById("file-profile-cover");
    profileCover.value = "";
    setProfileCoverFile(null);
  };

  const hitApiEditProfile = (idOfProfile, payloadData) => {
    updateProfileById(idOfProfile, payloadData)
      .then((editProfileByIdResponse) => {
        const successEditProfile = editProfileByIdResponse.data.success;
        if (successEditProfile) {
          doSnapForEditProfile(true);
          let avatar = document.getElementById("file-avatar");
          let profileCover = document.getElementById("file-profile-cover");
          avatar.value = "";
          profileCover.value = "";
          setAvatarUrlFile(null);
          setProfileCoverFile(null);
        }
      })
      .catch((error) => {
        console.log("failed edit profile by id message:", error.response);
      });
  };

  const processingEditProfilePicture = () => {
    let profilePayloadObj = {};

    if (avatarUrlFile) {
      const formData1 = new FormData();
      formData1.append("file", avatarUrlFile);
      formData1.append("upload_preset", "g7pxfer7");
      uploadImagePosting(formData1, {
        onUploadProgress: (progressEvent) => {
          setUploadProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
        .then((response) => {
          profilePayloadObj.avatarUrl = response.data.secure_url;
          hitApiEditProfile(profileId, profilePayloadObj);
          setUploadProgress(0);
        })
        .catch((error) => {
          console.error("upload image failed avatar", error);
        });
    }

    if (profileCoverFile) {
      const formData2 = new FormData();
      formData2.append("file", profileCoverFile);
      formData2.append("upload_preset", "g7pxfer7");
      uploadImagePosting(formData2, {
        onUploadProgress: (progressEvent) => {
          setUploadProgressProfile(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
        .then((response) => {
          profilePayloadObj.profileCoverUrl = response.data.secure_url;
          hitApiEditProfile(profileId, profilePayloadObj);
          setUploadProgressProfile(0);
        })
        .catch((error) => {
          console.error("upload image failed profile cover", error);
        });
    }
  };

  const doSaveEditProfile = () => {
    processingEditProfilePicture();
  };

  const visibilityStylingCondition = () => {
    return {
      visibility:
        uploadProgress > 0 || uploadProgressProfile > 0 ? "hidden" : "visible",
    };
  };

  return (
    <EditProfileModalWrapper>
      <TopContent
        title="Edit Your Avatar and Cover Url"
        closeModalEdit={() => closeModalEdit(false)}
      />

      <MiddleContent>
        <Fragment>
          {/* AVATAR URL ========================== */}
          <label style={{ marginBottom: 6 }}>Avatar Url</label>
          <ImageUploadFrameWrapper additionalStyle={{ marginBottom: 20 }}>
            {uploadProgress > 0 && (
              <div className="progress-upload-wrapper">
                <span className="upload-progress-persen">
                  {`Uploading new avatar: ${uploadProgress}%`}
                </span>
                <span
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <input
              ref={avatarRef}
              id="file-avatar"
              type="file"
              hidden
              className="edit-profile-url"
              accept=".png,.jpeg,.jpg"
              onChange={(e) => setAvatarUrlFile(e.target.files[0])}
            />

            {/* Preview Avatar Image before uploading */}
            {avatarUrlFile && (
              <div className="preview-img-container">
                <img
                  src={URL.createObjectURL(avatarUrlFile)}
                  alt="preview-img"
                  className="preview-img"
                />

                <CancelIcon
                  className="cancel-preview-img"
                  onClick={cancelAvatarPreviewHandler}
                />
              </div>
            )}

            {/* Preview Avatar Image from DB */}
            {avatarUrl && !avatarUrlFile && (
              <div className="preview-img-container">
                <img
                  src={avatarUrl}
                  alt="preview-img"
                  className="preview-img"
                />
              </div>
            )}

            <div
              style={{
                border: "1px solid black",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
              }}
              onClick={uploadAvatar}
            >
              Upload Avatar Image
            </div>
          </ImageUploadFrameWrapper>

          {/* PROFILE COVER URL ========================== */}
          <label style={{ marginBottom: 6 }}>Profile Cover Url</label>
          <ImageUploadFrameWrapper>
            {uploadProgressProfile > 0 && (
              <div className="progress-upload-wrapper">
                <span className="upload-progress-persen">
                  {`Uploading new profile cover: ${uploadProgressProfile}%`}
                </span>
                <span
                  className="progress-bar"
                  style={{ width: `${uploadProgressProfile}%` }}
                />
              </div>
            )}

            <input
              ref={coverImageRef}
              id="file-profile-cover"
              type="file"
              hidden
              className="edit-profile-url"
              accept=".png,.jpeg,.jpg"
              onChange={(e) => setProfileCoverFile(e.target.files[0])}
            />

            {/* Preview Profile Cover Image before uploading */}
            {profileCoverFile && (
              <div className="preview-img-container">
                <img
                  src={URL.createObjectURL(profileCoverFile)}
                  alt="preview-img"
                  className="preview-img"
                />

                <CancelIcon
                  className="cancel-preview-img"
                  onClick={cancelProfilePreviewHandler}
                />
              </div>
            )}

            {/* Preview Profile Cover Image from DB */}
            {profileCover && !profileCoverFile && (
              <div className="preview-img-container">
                <img
                  src={profileCover}
                  alt="preview-img"
                  className="preview-img"
                />
              </div>
            )}

            <div
              style={{
                border: "1px solid black",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
              }}
              onClick={uploadCoverImage}
            >
              Upload Cover Image
            </div>
          </ImageUploadFrameWrapper>
        </Fragment>
      </MiddleContent>

      <BottomContent>
        {(avatarUrlFile || profileCoverFile) && (
          <GlobalButton
            buttonLabel={"Batal Edit Image"}
            classStyleName={"bottom-edit-button cancel"}
            additionalStyleOveride={visibilityStylingCondition()}
            onClick={() => closeModalEdit(false)}
          />
        )}

        {(avatarUrlFile || profileCoverFile) && (
          <GlobalButton
            buttonLabel={"Simpan Avatar or Cover"}
            classStyleName={"bottom-edit-button save"}
            additionalStyleOveride={visibilityStylingCondition()}
            onClick={doSaveEditProfile}
          />
        )}
      </BottomContent>
    </EditProfileModalWrapper>
  );
}
