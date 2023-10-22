import React, { useState, Fragment, useMemo } from "react";
import { updateProfileById } from "../../apiCalls/profileApiFetch";
import InputTextGlobalV2 from "../input-text-global-v2/InputTextGlobalV2";
import GlobalButton from "../button/GlobalButton";
import EditProfileModalWrapper from "../edit-profile-modal-wrapper/EditProfileModalWrapper";
import TopContent from "../edit-profile-modal-wrapper/top-content/TopContent";
import MiddleContent from "../edit-profile-modal-wrapper/middle-content/MiddleContent";
import BottomContent from "../edit-profile-modal-wrapper/bottom-content/BottomContent";
import { getFirstError } from "../../utils/formValidationFunction";
import { useFormValidation } from "../../custom-hooks/useFormValidation";

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
  const [userPhoneNumber, setUserPhoneNumber] = useState(userProfileData.phoneNumber || "");
  const [userCurrentCity, setUserCurrentCity] = useState(userProfileData.currentCity || "");
  const [userNationality, setUserNationality] = useState(userProfileData.nationality || "");
  const [userRelationship, setUserRelationship] = useState(userProfileData.relationship || "");
  const [valuesOnBlur, setValuesOnBlur] = useState({
    biodata: false,
    addressData: false,
    birthdate: false,
    statusUser: false,
    quotes: false,
    userPhoneNumber: false,
    userCurrentCity: false,
    userNationality: false,
    userRelationship: false,
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
  };

  const editProfileRulesSchema = useMemo(
    () => ({
      biodata: { currentValue: biodata, isRequired: true },
      addressData: { currentValue: addressData, isRequired: true },
      birthdate: { currentValue: birthdate, isRequired: true },
      statusUser: { currentValue: statusUser, isRequired: true },
      quotes: { currentValue: quotes, isRequired: true },
      userPhoneNumber: { currentValue: userPhoneNumber, isRequired: true },
      userCurrentCity: { currentValue: userCurrentCity, isRequired: true },
      userNationality: { currentValue: userNationality, isRequired: true },
      userRelationship: { currentValue: userRelationship, isRequired: true },
    }),
    [
      biodata,
      addressData,
      birthdate,
      statusUser,
      quotes,
      userPhoneNumber,
      userCurrentCity,
      userNationality,
      userRelationship,
    ]
  );

  const { isValid, errorMessage } = useFormValidation({
    rulesSchema: editProfileRulesSchema,
  });

  const doSaveEditProfile = () => {
    handleAllOnBlurToTrue(true);

    if (isValid) {
      processingEditProfile();
    }
  };

  const handleInputErrorMessage = (type) => {
    return valuesOnBlur[type] ? getFirstError(errorMessage[type]) : [];
  };

  const handleSetValuesOnBlur = (value, type) => {
    if (value) {
      setValuesOnBlur((oldObjVal) => ({
        ...oldObjVal,
        [type]: true,
      }));
    }
  };

  const handleAllOnBlurToTrue = (boolVal) => {
    const onBlurObjKeys = Object.keys(valuesOnBlur);

    for (let i = 0; i < onBlurObjKeys.length; i++) {
      setValuesOnBlur((oldValObj) => ({
        ...oldValObj,
        [onBlurObjKeys[i]]: boolVal,
      }));
    }
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
            value={biodata}
            onChange={(e) =>setBiodata(e.target.value)}
            inputPlaceholder={"Masukkan biodata-mu"}
            onBlur={(e) => handleSetValuesOnBlur(e.target.value, "biodata")}
            inputErrorMessage={handleInputErrorMessage("biodata")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Alamat"}
            value={addressData}
            onChange={(e) =>setAddressData(e.target.value)}
            inputPlaceholder={"Masukkan alamat-mu"}
            onBlur={(e) => handleSetValuesOnBlur(e.target.value, "addressData")}
            inputErrorMessage={handleInputErrorMessage("addressData")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Tanggal Lahir"}
            value={birthdate}
            onChange={(e) =>setBirthdate(e.target.value)}
            onBlur={(e) => handleSetValuesOnBlur(e.target.value, "birthdate")}
            inputErrorMessage={handleInputErrorMessage("birthdate")}
            inputType={"date"}
            additionalStylingClass={"if-edit-profile-style-date"}
          />

          <InputTextGlobalV2
            inputLabel={"Status"}
            value={statusUser}
            onChange={(e) =>setStatusUser(e.target.value)}
            inputPlaceholder={"Masukan status-mu"}
            onBlur={(e) => handleSetValuesOnBlur(e.target.value, "statusUser")}
            inputErrorMessage={handleInputErrorMessage("statusUser")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Quotes"}
            value={quotes}
            onChange={(e) =>setQuotes(e.target.value)}
            inputPlaceholder={"Masukan quotes favorit-mu"}
            onBlur={(e) => handleSetValuesOnBlur(e.target.value, "quotes")}
            inputErrorMessage={handleInputErrorMessage("quotes")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Nomor Telephone"}
            value={userPhoneNumber}
            onChange={(e) =>setUserPhoneNumber(e.target.value)}
            inputPlaceholder={"Masukkan nomor telepon-mu"}
            onBlur={(e) =>
              handleSetValuesOnBlur(e.target.value, "userPhoneNumber")
            }
            inputErrorMessage={handleInputErrorMessage("userPhoneNumber")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Kota Domisili"}
            value={userCurrentCity}
            onChange={(e) =>setUserCurrentCity(e.target.value)}
            inputPlaceholder={"Masukkan nama kota kamu tinggal sekarang"}
            onBlur={(e) =>
              handleSetValuesOnBlur(e.target.value, "userCurrentCity")
            }
            inputErrorMessage={handleInputErrorMessage("userCurrentCity")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Kebangsaan"}
            value={userNationality}
            onChange={(e) =>setUserNationality(e.target.value)}
            inputPlaceholder={"Masukkan kebangsaan-mu"}
            onBlur={(e) =>
              handleSetValuesOnBlur(e.target.value, "userNationality")
            }
            inputErrorMessage={handleInputErrorMessage("userNationality")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Relationship"}
            value={userRelationship}
            onChange={(e) =>setUserRelationship(e.target.value)}
            inputPlaceholder={"Masukkan hubungan-mu dengan siapa"}
            onBlur={(e) =>
              handleSetValuesOnBlur(e.target.value, "userRelationship")
            }
            inputErrorMessage={handleInputErrorMessage("userRelationship")}
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
