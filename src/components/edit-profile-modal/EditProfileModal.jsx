import React, { useState, Fragment } from "react";
import { formValidation } from "../../utils/formValidationFunction";
import { updateProfileById } from "../../apiCalls/profileApiFetch";
import InputTextGlobalV2 from "../input-text-global-v2/InputTextGlobalV2";
import GlobalButton from "../button/GlobalButton";
import EditProfileModalWrapper from "../edit-profile-modal-wrapper/EditProfileModalWrapper";
import TopContent from "../edit-profile-modal-wrapper/top-content/TopContent";
import MiddleContent from "../edit-profile-modal-wrapper/middle-content/MiddleContent";
import BottomContent from "../edit-profile-modal-wrapper/bottom-content/BottomContent";

import "./EditProfileModal.scss";

const EditProfileModal = ({
  closeModalEditProfile,
  userProfileData,
  doSnapForEditProfile,
}) => {
  const profileId = userProfileData.id;

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
  const [errorMessage, setErrorMessage] = useState({
    biodata: [],
    address: [],
    birthDate: [],
    status: [],
    quotes: [],
    phoneNumber: [],
    currentCity: [],
    nationality: [],
    relationship: [],
  });

  const closeModalEdit = (statusValue) => {
    closeModalEditProfile(statusValue);
  };

  const hitApiEditProfile = (idOfProfile, payloadData) => {
    updateProfileById(idOfProfile, payloadData)
      .then((editProfileByIdResponse) => {
        const successEditProfile = editProfileByIdResponse.data.success;
        if (successEditProfile) {
          doSnapForEditProfile(true);
          closeModalEditProfile(false);
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

  const doSaveEditProfile = () => {
    processingEditProfile();
  };

  return (
    <EditProfileModalWrapper>
      <TopContent
        title="Edit Your Profile"
        closeModalEdit={() => closeModalEdit(false)}
      />

      <MiddleContent>
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
      </MiddleContent>

      <BottomContent>
        <GlobalButton
          buttonLabel={"Batal"}
          classStyleName={"bottom-edit-button cancel"}
          onClick={() => closeModalEdit(false)}
        />

        <GlobalButton
          buttonLabel={"Simpan"}
          classStyleName={"bottom-edit-button save"}
          onClick={doSaveEditProfile}
        />
      </BottomContent>
    </EditProfileModalWrapper>
  );
};

export default EditProfileModal;
