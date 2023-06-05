import React, {
  useState,
  useEffect,
  useCallback,
  // Fragment,
  useMemo,
} from "react";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
// import { searchAllUsersAndPostsData } from "../../apiCalls/searchUserAndPosts";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
// import { getAllPostsBySearch } from "../../apiCalls/postsApiFetch";
import { useSelector, useDispatch } from "react-redux";
import { accessToken } from "../../utils/getLocalStorage";
import { setSearchPostsTerms } from "../../redux/slices/postsSlice";
import {
  setFollowerNotif,
  setMessageNotif,
  setPostNotif,
} from "../../redux/slices/notificationSlice";
import ProfileBox from "../profile-box/ProfileBox";
import { useScreenWidth } from "../../utils/screenWidth";
import "./Topbar.scss";

export default function Topbar() {
  const access_token = accessToken();

  const isDesktop = useScreenWidth("lg");

  const notificationsPath = {
    follower: "/follower-notifications",
    message: "/message-notifications",
    post: "/post-notifications",
  };

  const dispatch = useDispatch();

  let navigate = useNavigate();

  const { pathname } = useLocation();

  const currentPathName = useMemo(() => {
    const path = pathname;
    return path;
  }, [pathname]);

  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );
  const followerNotifFromSlice = useSelector((state) =>
    state.notifications.followerNotif.filter((item) => !item.isRead)
  );
  const postNotifFromSlice = useSelector((state) =>
    state.notifications.postNotif.filter((item) => !item.isRead)
  );
  const messageNotifFromSlice = useSelector((state) =>
    state.notifications.messageNotif.filter((item) => !item.isRead)
  );
  const userSnapRegisteredStatus = useSelector(
    (state) => state.user.snapUserLogout
  );

  const totalFollowerNotif = useMemo(
    () => followerNotifFromSlice.length,
    [followerNotifFromSlice]
  );
  const totalMessageNotif = useMemo(
    () => messageNotifFromSlice.length,
    [messageNotifFromSlice]
  );
  const totalPostNotif = useMemo(
    () => postNotifFromSlice.length,
    [postNotifFromSlice]
  );

  // const [searchedItems, setSearchedItems] = useState([]);
  // const [searchedPostItems, setSearchedPostItems] = useState([]);
  const [searchTerms, setSearchTerms] = useState("");
  // const [errorSearchMessage, setErrorSearchMessage] = useState("");
  // const [isShowSearchBox, setIsShowSearchBox] = useState(false);

  const handleSearchOnChange = (value) => {
    const targetValue = value;
    setSearchTerms(targetValue);
    dispatch(setSearchPostsTerms({ getSearchTermsForPosts: targetValue }));
  };

  const goToSearchPage = useCallback(() => {
    if (!searchTerms) return;
    navigate({
      pathname: "/search",
      search: `?query=${searchTerms}`,
    });
  }, [searchTerms, navigate]);

  const goToSearchPageByEnter = (event) => {
    if (event.key === "Enter") {
      goToSearchPage();
    }
  };

  // const unShowSearchBox = () => {
  //   setIsShowSearchBox(false);
  // };

  // const showSearchBoxWhenFocus = (event) => {
  //   if (event.bubbles === true) {
  //     setIsShowSearchBox(true);
  //   }
  // };

  const getActiveColor = (inputPathName) => {
    return inputPathName === currentPathName ? "#2c2891" : "#3571d9";
  };

  const checkActiveBadgeFollowerNotif = () => {
    if (totalFollowerNotif) {
      return <span className="topbar-icon-badge">{totalFollowerNotif}</span>;
    }
  };

  const checkActiveBadgeMessageNotif = () => {
    if (totalMessageNotif) {
      return <span className="topbar-icon-badge">{totalMessageNotif}</span>;
    }
  };

  const checkActiveBadgeNotifications = () => {
    if (totalPostNotif) {
      return <span className="topbar-icon-badge">{totalPostNotif}</span>;
    }
  };

  // const displaySearchResultBoxBasedTermsLenght = () => {
  //   if (searchTerms && searchTerms.length >= 3 && isShowSearchBox) {
  //     if (
  //       errorSearchMessage &&
  //       !searchedItems.length &&
  //       !searchedPostItems.length
  //     ) {
  //       return <div className="searchResultBoxk">{errorSearchMessage}</div>;
  //     }

  //     if (
  //       (searchedItems && searchedItems.length) ||
  //       (searchedPostItems && searchedPostItems.length)
  //     ) {
  //       return (
  //         <Fragment>
  //           <div className="searchResultBoxk">
  //             {searchedItems.map((item) => (
  //               <Link
  //                 key={item.id}
  //                 to={`/profile/${item.userName}/user-id/${item.id}`}
  //                 style={{ textDecoration: "none", color: "black" }}
  //                 onClick={unShowSearchBox}
  //               >
  //                 <div className="search-item">{item.userName}</div>
  //               </Link>
  //             ))}

  //             {searchedPostItems.map((postItem) => (
  //               <Link
  //                 key={postItem.id}
  //                 to={`/profile/${postItem.User.userName}/user-id/${postItem.User.id}`}
  //                 style={{ textDecoration: "none", color: "black" }}
  //                 onClick={unShowSearchBox}
  //               >
  //                 <div className="search-item">{postItem.User.userName}</div>
  //               </Link>
  //             ))}
  //           </div>
  //         </Fragment>
  //       );
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (searchTerms && searchTerms.length >= 3) {
  //     setIsShowSearchBox(true);
  //   }
  // }, [searchTerms]);

  // useEffect(() => {
  //   const getUsersAndPostsThroughSearch = () => {
  //     searchAllUsersAndPostsData(access_token, searchTerms)
  //       .then((searchResult) => {
  //         setSearchedItems(searchResult.data.userData);
  //       })
  //       .catch((error) => {
  //         const errorMessageSearch = error.response.data.err.message;
  //         setErrorSearchMessage(errorMessageSearch);
  //         setSearchedItems([]);
  //       });
  //   };

  //   const hitApiSearchPosts = () => {
  //     getAllPostsBySearch(access_token, searchTerms)
  //       .then((searchPostsResult) => {
  //         setSearchedPostItems(searchPostsResult.data.postData);
  //       })
  //       .catch((error) => {
  //         const errorMessageFailedSearch = error.response.data.err.message;
  //         setErrorSearchMessage(errorMessageFailedSearch);
  //         setSearchedPostItems([]);
  //       });
  //   };

  //   if (searchTerms && searchTerms.length >= 3 && access_token) {
  //     setSearchedItems([]);
  //     setTimeout(() => {
  //       getUsersAndPostsThroughSearch();
  //       hitApiSearchPosts();
  //     }, 1700);
  //   }
  // }, [searchTerms, access_token]);

  useEffect(() => {
    if (access_token) {
      getNotificationsBelongsToLoggedUser(access_token, dispatch);
    }

    return () => {
      dispatch(setFollowerNotif({ followerNotifData: [] }));
      dispatch(setMessageNotif({ messageNotifData: [] }));
      dispatch(setPostNotif({ postNotifData: [] }));
    };
  }, [access_token, userSnapRegisteredStatus, dispatch]);

  return (
    <div className="topbar-container">
      {/* Left Topbar */}
      {/* onClick={unShowSearchBox} */}
      <div className="topbar-left">
        <Link className="logo" to="/">
          {isDesktop ? 'Omongin' : 'Omg'}
        </Link>
      </div>

      {/* Middle Topbar */}
      <div className="topbar-middle">
        <div className="search-bar" onKeyPress={goToSearchPageByEnter}>
          <SearchIcon
            style={{ cursor: "pointer" }}
            className="search-icon"
            onClick={goToSearchPage}
          />
          <input
            className="search-input"
            id="search-input-terms"
            placeholder="Cari teman, postingan atau video"
            type="text"
            value={searchTerms}
            // onChange={(e) => setSearchTerms(e.target.value)}
            onChange={(e) => handleSearchOnChange(e.target.value)}
          ></input>
          {/* onFocus={showSearchBoxWhenFocus} */}
        </div>
        {/* {displaySearchResultBoxBasedTermsLenght()} */}
      </div>

      {/* Right Topbar */}
      {/* onClick={unShowSearchBox} */}
      <div className="topbar-right">
        <div className="topbar-right-wrapper">
          {isDesktop && (
            <div className="topbar-icons">
              <Link
                to={notificationsPath.follower}
                style={{
                  textDecoration: "none",
                  color: getActiveColor(notificationsPath.follower),
                }}
                className="topbar-icon-item"
              >
                <PersonIcon className="topbar-notif-icon" />
                {checkActiveBadgeFollowerNotif()}
              </Link>

              <Link
                to={notificationsPath.message}
                style={{
                  textDecoration: "none",
                  color: getActiveColor(notificationsPath.message),
                }}
                className="topbar-icon-item"
              >
                <ChatIcon className="topbar-notif-icon" />
                {checkActiveBadgeMessageNotif()}
              </Link>

              <Link
                to={notificationsPath.post}
                style={{
                  textDecoration: "none",
                  color: getActiveColor(notificationsPath.post),
                }}
                className="topbar-icon-item"
              >
                <NotificationsIcon className="topbar-notif-icon" />
                {checkActiveBadgeNotifications()}
              </Link>
            </div>
          )}

          <div className="image-profile-container">
            <div className="topbar-img-wrapper">
              <img
                src={currentUserAvatarFromSlice}
                alt="user-profile"
                className="topbar-img"
              />
              <div className="profile-box-wrapper">
                <ProfileBox />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
