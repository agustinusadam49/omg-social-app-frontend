import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./BirthdayEvent.scss";

const BirthdayEvent = ({ usersBirthday }) => {
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const usersHBD = usersBirthday;

  const checkBirthDayLength = () => {
    if (usersHBD.length < 2) {
      return (
        <Fragment>
          <span className="birthday-text">
            <strong>{displayFirstUser}</strong> sedang berulang tahun hari ini.
          </span>
        </Fragment>
      );
    }

    if (usersHBD.length > 1) {
      return (
        <Fragment>
          <span className="birthday-text">
            <strong>{displayFirstUser}</strong> dan{" "}
            <strong>{usersHBD.length - 1} orang yang lain</strong> sedang
            berulang tahun hari ini.
          </span>
        </Fragment>
      );
    }
  };

  const displayFirstUser = useMemo(() => {
    const checkCurrentUser = usersHBD.filter(
      (user) => user.id === currentUserIdFromSlice
    )[0];
    return checkCurrentUser ? "Anda" : usersHBD[0].userName;
  }, [usersHBD, currentUserIdFromSlice]);

  return (
    <Link className="birthday-container" to="/events">
      <img
        className="birthday-img"
        src="/assets/gift.png"
        alt="birthday-gift"
      />
      {checkBirthDayLength()}
    </Link>
  );
};

export default BirthdayEvent;
