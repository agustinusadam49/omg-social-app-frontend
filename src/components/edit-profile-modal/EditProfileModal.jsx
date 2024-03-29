import React, { useState, Fragment, useMemo } from "react";
import { updateProfileById } from "../../apiCalls/profileApiFetch";
import InputTextGlobalV2 from "../input-text-global-v2/InputTextGlobalV2";
import GlobalButton from "../button/GlobalButton";
import EditProfileModalWrapper from "../edit-profile-modal-wrapper/EditProfileModalWrapper";
import TopContent from "../edit-profile-modal-wrapper/top-content/TopContent";
import MiddleContent from "../edit-profile-modal-wrapper/middle-content/MiddleContent";
import BottomContent from "../edit-profile-modal-wrapper/bottom-content/BottomContent";
import {
  getFirstError,
  helpersWithMessage,
} from "../../utils/formValidationFunction";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import { useDispatch } from "react-redux";
import { setIsClicked } from "../../redux/slices/buttonsSlice";

import "./EditProfileModal.scss";

const EditProfileModal = ({
  closeModalEditProfile,
  userProfileData,
  doSnapForEditProfile,
}) => {
  const dispatch = useDispatch();
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

    profilePayloadObj = {
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

    hitApiEditProfile(profileId, profilePayloadObj);
  };

  const editProfileRulesSchema = useMemo(
    () => ({
      biodata: { currentValue: biodata, isRequired: true },
      addressData: { currentValue: addressData, isRequired: true },
      birthdate: { currentValue: birthdate, isRequired: true },
      statusUser: { currentValue: statusUser, isRequired: true },
      quotes: { currentValue: quotes, isRequired: true },
      userPhoneNumber: {
        currentValue: userPhoneNumber,
        isRequired: true,
        validationCollections: [
          helpersWithMessage(
            "Nomor HP harus memiliki minimal 10 dan maximal 13 digit",
            userPhoneNumber,
            (val) => {
              const minCharacterLength = 10;
              const maxCharacterLength = 13;

              return (
                val.length >= minCharacterLength &&
                val.length <= maxCharacterLength
              );
            }
          ),
          helpersWithMessage(
            "Nomor HP harus berupa angka digit",
            userPhoneNumber,
            (val) => {
              const isOnlyNumberTest = /^\d+$/.test(val);
              return isOnlyNumberTest;
            }
          ),
        ],
      },
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
    dispatch(setIsClicked({ payload: true }));

    if (isValid) {
      processingEditProfile();
    }
  };

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessage[type]);
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
            onChange={(e) => setBiodata(e.target.value)}
            inputPlaceholder={"Masukkan biodata-mu"}
            inputErrorMessage={handleInputErrorMessage("biodata")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Alamat"}
            value={addressData}
            onChange={(e) => setAddressData(e.target.value)}
            inputPlaceholder={"Masukkan alamat-mu"}
            inputErrorMessage={handleInputErrorMessage("addressData")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Tanggal Lahir"}
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            inputErrorMessage={handleInputErrorMessage("birthdate")}
            inputType={"date"}
            additionalStylingClass={"if-edit-profile-style-date"}
          />

          <InputTextGlobalV2
            inputLabel={"Status"}
            value={statusUser}
            onChange={(e) => setStatusUser(e.target.value)}
            inputPlaceholder={"Masukan status-mu"}
            inputErrorMessage={handleInputErrorMessage("statusUser")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Quotes"}
            value={quotes}
            onChange={(e) => setQuotes(e.target.value)}
            inputPlaceholder={"Masukan quotes favorit-mu"}
            inputErrorMessage={handleInputErrorMessage("quotes")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Nomor Telephone"}
            value={userPhoneNumber}
            onChange={(e) => setUserPhoneNumber(e.target.value)}
            inputPlaceholder={"Masukkan nomor telepon-mu"}
            inputErrorMessage={handleInputErrorMessage("userPhoneNumber")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Kota Domisili"}
            value={userCurrentCity}
            onChange={(e) => setUserCurrentCity(e.target.value)}
            inputPlaceholder={"Masukkan nama kota kamu tinggal sekarang"}
            inputErrorMessage={handleInputErrorMessage("userCurrentCity")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Kebangsaan"}
            value={userNationality}
            onChange={(e) => setUserNationality(e.target.value)}
            inputPlaceholder={"Masukkan kebangsaan-mu"}
            inputErrorMessage={handleInputErrorMessage("userNationality")}
            additionalStylingClass={"if-edit-profile-style"}
          />

          <InputTextGlobalV2
            inputLabel={"Relationship"}
            value={userRelationship}
            onChange={(e) => setUserRelationship(e.target.value)}
            inputPlaceholder={"Masukkan hubungan-mu dengan siapa"}
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
