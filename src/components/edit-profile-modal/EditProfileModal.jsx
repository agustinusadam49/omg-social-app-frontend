import React, { useState, Fragment } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { formValidation } from "../../utils/formValidationFunction";
import { updateProfileById } from "../../apiCalls/profileApiFetch";
import { uploadImagePosting } from "../../apiCalls/postsApiFetch";
import InputTextGlobalV2 from "../input-text-global-v2/InputTextGlobalV2";
import GlobalButton from "../button/GlobalButton";
import "./EditProfileModal.scss";

const EditProfileModal = ({
  closeModalEditProfile,
  userProfileData,
  doSnapForEditProfile,
  modalActive,
}) => {
  const profileId = userProfileData.id;
  const avatarUrl = userProfileData.avatarUrl;
  const profileCover = userProfileData.profileCoverUrl;

  const [biodata, setBiodata] = useState(userProfileData.biodata || "");
  const [addressData, setAddressData] = useState(userProfileData.address || "");
  const [birthdate, setBirthdate] = useState(userProfileData.birthDate || "");
  const [statusUser, setStatusUser] = useState(userProfileData.status || "");
  const [quotes, setQuotes] = useState(userProfileData.quotes || "");
  const [userPhoneNumber, setUserPhoneNumber] = useState(
    userProfileData.phoneNumber || ""
  );
  const [userCurrentCity, setUserCurrentCity] = useState(
    userProfileData.currentCity || ""
  );
  const [userNationality, setUserNationality] = useState(
    userProfileData.nationality || ""
  );
  const [userRelationship, setUserRelationship] = useState(
    userProfileData.relationship || ""
  );
  const [avatarUrlFile, setAvatarUrlFile] = useState(null);
  const [profileCoverFile, setProfileCoverFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressProfile, setUploadProgressProfile] = useState(0);
  const [errorMessage, setErrorMessage] = useState({
    avatarUrlFile: [],
    biodata: [],
    address: [],
    birthDate: [],
    status: [],
    quotes: [],
    phoneNumber: [],
    profileCoverFile: [],
    currentCity: [],
    nationality: [],
    relationship: [],
  });

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

  const closeModalEdit = (statusValue) => {
    closeModalEditProfile(statusValue);
  };

  const hitApiEditProfile = (idOfProfile, payloadData) => {
    updateProfileById(idOfProfile, payloadData)
      .then((editProfileByIdResponse) => {
        const successEditProfile = editProfileByIdResponse.data.success;
        if (successEditProfile) {
          doSnapForEditProfile(true);
          if (modalActive === "edit-profile") {
            closeModalEditProfile(false);
          }

          if (modalActive === "edit-avatar-and-cover-url") {
            let avatar = document.getElementById("file-avatar");
            let profileCover = document.getElementById("file-profile-cover");
            avatar.value = "";
            profileCover.value = "";
            setAvatarUrlFile(null);
            setProfileCoverFile(null);
          }
        }
      })
      .catch((error) => {
        console.log("failed edit profile by id message:", error.response);
      });
  };

  const processingEditProfile = () => {
    let profilePayloadObj = {};

    const profileDataToValidateCheck = {
      biodata: biodata,
      address: addressData,
      birthDate: birthdate,
      status: statusUser,
      quotes: quotes,
      phoneNumber: userPhoneNumber,
      currentCity: userCurrentCity,
      nationality: userNationality,
      relationship: userRelationship,
    };

    const isValid = formValidation(profileDataToValidateCheck, setErrorMessage);

    if (isValid) {
      profilePayloadObj = {
        biodata: profileDataToValidateCheck.biodata,
        address: profileDataToValidateCheck.address,
        birthDate: profileDataToValidateCheck.birthDate,
        status: profileDataToValidateCheck.status,
        quotes: profileDataToValidateCheck.quotes,
        phoneNumber: profileDataToValidateCheck.phoneNumber,
        currentCity: profileDataToValidateCheck.currentCity,
        nationality: profileDataToValidateCheck.nationality,
        relationship: profileDataToValidateCheck.relationship,
      };

      hitApiEditProfile(profileId, profilePayloadObj);
    }
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
    if (modalActive === "edit-profile") {
      processingEditProfile();
    }

    if (modalActive === "edit-avatar-and-cover-url") {
      processingEditProfilePicture();
    }
  };

  const visibilityStylingCondition = () => {
    return {
      visibility:
        uploadProgress > 0 || uploadProgressProfile > 0 ? "hidden" : "visible",
    };
  };

  return (
    <div className="content-container edit-profile-modal">
      <div className="modal-content-wrapper">
        {/* Top Content of Modal */}
        <div className="top-content">
          {modalActive === "edit-profile" && (
            <div className="edit-profile-modal-content">Edit Your Profile</div>
          )}
          {modalActive === "edit-avatar-and-cover-url" && (
            <div className="edit-profile-modal-content">
              Edit Your Avatar and Cover Url
            </div>
          )}
          <CancelIcon
            className="modal-close-button"
            onClick={() => closeModalEdit(false)}
          />
        </div>

        {/* Middle Content of Modal */}
        <div className="middle-content">
          <div className="input-profile-box">
            {modalActive === "edit-avatar-and-cover-url" && (
              <Fragment>
                {/* AVATAR URL ======================================================== */}
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

                <label>Avatar Url</label>
                <input
                  id="file-avatar"
                  type="file"
                  className="edit-profile-url"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setAvatarUrlFile(e.target.files[0])}
                />
                <div className="inputErrorMessage">
                  {errorMessage.avatarUrlFile}
                </div>

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

                {/* PROFILE COVER URL =========================================================== */}
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

                <label>Profile Cover Url</label>
                <input
                  id="file-profile-cover"
                  type="file"
                  className="edit-profile-url"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setProfileCoverFile(e.target.files[0])}
                />
                <div className="inputErrorMessage">
                  {errorMessage.profileCoverFile}
                </div>

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
              </Fragment>
            )}

            {modalActive === "edit-profile" && (
              <Fragment>
                <InputTextGlobalV2
                  inputLabel={"Biodata"}
                  inputValue={biodata}
                  inputPlaceholder={"Masukkan biodata-mu"}
                  setInputValue={setBiodata}
                  inputErrorMessage={errorMessage.biodata}
                  additionalStylingClass={"if-edit-profile-style"}
                />

                <InputTextGlobalV2
                  inputLabel={"Alamat"}
                  inputPlaceholder={"Masukkan alamat-mu"}
                  inputValue={addressData}
                  setInputValue={setAddressData}
                  inputErrorMessage={errorMessage.address}
                  additionalStylingClass={"if-edit-profile-style"}
                />

                {/* <label>Birth Date:</label> */}
                <InputTextGlobalV2
                  inputLabel={"Tanggal Lahir"}
                  inputValue={birthdate}
                  setInputValue={setBirthdate}
                  inputErrorMessage={errorMessage.birthDate}
                  inputType={"date"}
                  additionalStylingClass={"if-edit-profile-style-date"}
                />

                <InputTextGlobalV2
                  inputLabel={"Status"}
                  inputPlaceholder={"Masukan status-mu"}
                  inputValue={statusUser}
                  setInputValue={setStatusUser}
                  inputErrorMessage={errorMessage.status}
                  additionalStylingClass={"if-edit-profile-style"}
                />

                <InputTextGlobalV2
                  inputLabel={"Quotes"}
                  inputPlaceholder={"Masukan quotes favorit-mu"}
                  inputValue={quotes}
                  setInputValue={setQuotes}
                  inputErrorMessage={errorMessage.quotes}
                  additionalStylingClass={"if-edit-profile-style"}
                />

                <InputTextGlobalV2
                  inputLabel={"Nomor Telephone"}
                  inputPlaceholder={"Masukkan nomor telepon-mu"}
                  inputValue={userPhoneNumber}
                  setInputValue={setUserPhoneNumber}
                  inputErrorMessage={errorMessage.phoneNumber}
                  additionalStylingClass={"if-edit-profile-style"}
                />

                <InputTextGlobalV2
                  inputLabel={"Kota Domisili"}
                  inputPlaceholder={"Masukkan nama kota kamu tinggal sekarang"}
                  inputValue={userCurrentCity}
                  setInputValue={setUserCurrentCity}
                  inputErrorMessage={errorMessage.currentCity}
                  additionalStylingClass={"if-edit-profile-style"}
                />

                <InputTextGlobalV2
                  inputLabel={"Kebangsaan"}
                  inputPlaceholder={"Masukkan kebangsaan-mu"}
                  inputValue={userNationality}
                  setInputValue={setUserNationality}
                  inputErrorMessage={errorMessage.nationality}
                  additionalStylingClass={"if-edit-profile-style"}
                />

                <InputTextGlobalV2
                  inputLabel={"Relationship"}
                  inputPlaceholder={"Masukkan hubungan-mu dengan siapa"}
                  inputValue={userRelationship}
                  setInputValue={setUserRelationship}
                  inputErrorMessage={errorMessage.relationship}
                  additionalStylingClass={"if-edit-profile-style"}
                />
              </Fragment>
            )}
          </div>
        </div>

        {/* Bottom Content of Modal */}
        <div className="bottom-content">
          {modalActive === "edit-profile" && (
            <GlobalButton
              buttonLabel={"Batal"}
              classStyleName={"bottom-edit-button cancel"}
              onClick={() => closeModalEdit(false)}
            />
          )}

          {modalActive === "edit-profile" && (
            <GlobalButton
              buttonLabel={"Simpan"}
              classStyleName={"bottom-edit-button save"}
              onClick={doSaveEditProfile}
            />
          )}

          {modalActive === "edit-avatar-and-cover-url" &&
            (avatarUrlFile || profileCoverFile) && (
              <GlobalButton
                buttonLabel={"Batal Edit Image"}
                classStyleName={"bottom-edit-button cancel"}
                additionalStyleOveride={visibilityStylingCondition()}
                onClick={() => closeModalEdit(false)}
              />
            )}

          {modalActive === "edit-avatar-and-cover-url" &&
            (avatarUrlFile || profileCoverFile) && (
              <GlobalButton
                buttonLabel={"Simpan Avatar or Cover"}
                classStyleName={"bottom-edit-button save"}
                additionalStyleOveride={visibilityStylingCondition()}
                onClick={doSaveEditProfile}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
