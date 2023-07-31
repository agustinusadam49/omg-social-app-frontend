import React, { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { setIsUserSuggestionModalOpen } from "../../redux/slices/userSlice";
import { getAllUsersRegistered } from "../../redux/apiCalls";
import FriendList from "../friend/Friend-List";
import "./UserSuggestionModal.scss";

export default function UserSuggestionModal() {
  const dispatch = useDispatch();

  const [usersYouMayKnow, setUsersYouMayKnow] = useState([]);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const allUsersRegisterd = useSelector((state) => state.user.allUsers);
  const isThereMessageNotif = useSelector((state) => state.user.isGetMessageNotif);

  const toggleActiveSuggestionModal = (value) => {
    dispatch(setIsUserSuggestionModalOpen({ isSuggestionModalOpen: value }));
  };

  useEffect(() => {
    const usersWithoutCurrentUser = allUsersRegisterd.filter(
      (user) => user.id !== currentUserIdFromSlice
    );
    setUsersYouMayKnow(usersWithoutCurrentUser);
  }, [allUsersRegisterd, currentUserIdFromSlice]);

  useEffect(() => {
    getAllUsersRegistered(dispatch);
  }, [isThereMessageNotif, dispatch]);

  return (
    <div className="content-container user-suggestion-modal">
      <div className="user-suggestion-modal-content-wrapper">
        {/* Top Content of Modal */}
        <div className="user-suggestion-modal-top-content">
          <div className="user-suggestion-modal-top-content-title">
            Users Suggestion
          </div>
          <CancelIcon
            className="user-suggestion-modal-close-button"
            onClick={() => toggleActiveSuggestionModal(false)}
          />
        </div>

        {/* Bottom Content of Modal */}
        <div className="user-suggestion-modal-bottom-content">
          <ul className="user-suggestion-modal-bottom-content-friend-list">
            {!!usersYouMayKnow.length &&
              usersYouMayKnow.map((user) => (
                <FriendList key={user.id} user={user} />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
