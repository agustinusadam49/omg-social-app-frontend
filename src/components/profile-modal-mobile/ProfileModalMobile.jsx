import React from "react";
import { useDispatch } from "react-redux";
import { setIsUserProfileMobileOpen } from "../../redux/slices/userSlice";
import ProfileBox from "../profile-box/ProfileBox";
import CancelIcon from "@mui/icons-material/Cancel";

import "./ProfileModalMobile.scss";

export default function ProfileModalMobile() {
  const dispatch = useDispatch();
  const toggleProfileModalMobile = (value) => {
    dispatch(setIsUserProfileMobileOpen({ isUserProfileMobileOpen: value }));
  };
  return (
    <div className="content-container profile-modal-mobile">
      <div className="profile-modal-mobile-wrapper">
        {/* Top Content of Modal */}
        <div className="profile-modal-mobile-top-content">
          <div className="profile-modal-mobile-top-content-title">
            Users Profile Modal
          </div>
          <CancelIcon
            className="profile-modal-mobile-close-button"
            onClick={() => toggleProfileModalMobile(false)}
          />
        </div>

        {/* Bottom Content of Modal */}
        <ProfileBox classStyleAddOn={["mobile-screen-styling"]}/>
      </div>
    </div>
  );
}
