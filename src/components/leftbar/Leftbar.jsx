import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import EventIcon from "@mui/icons-material/Event";
import FriendList from "../friend/Friend-List";
import { getAllUsersRegistered } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import "./Leftbar.scss";

export default function Leftbar() {
  const dispatch = useDispatch();
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const allUsersRegisterd = useSelector((state) => state.user.allUsers);
  const [usersYouMayKnow, setUsersYouMayKnow] = useState([]);

  useEffect(() => {
    const usersWithoutCurrentUser = allUsersRegisterd.filter(
      (user) => user.id !== currentUserIdFromSlice
    );
    setUsersYouMayKnow(usersWithoutCurrentUser);
  }, [allUsersRegisterd, currentUserIdFromSlice]);

  useEffect(() => {
    getAllUsersRegistered(dispatch);
  }, [dispatch]);

  return (
    <div className="leftbar">
      <div className="leftbar-wrapper">
        <ul className="leftbar-list">
          <li className="leftbar-list-item">
            <RssFeedIcon className="leftbar-icon" />
            <Link className="leftbar-list-item-text" to="/">
              Feed
            </Link>
          </li>

          <li className="leftbar-list-item">
            <EventIcon className="leftbar-icon" />
            <Link className="leftbar-list-item-text" to="/events">
              Events
            </Link>
          </li>
        </ul>

        <hr className="leftbar-hr" />

        <ul className="leftbar-friend-list">
          {!!usersYouMayKnow.length && usersYouMayKnow.map((user) => (
            <FriendList key={user.id} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
}
