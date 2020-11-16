import React from "react";
import UserOptions from "./AccountUserOptions.js";
import GuestOptions from "./AccountGuestOptions.js";

const AccountMenu = (props) => {
  const isLoggedIn = props.IsLoggedIn;
  if (isLoggedIn) {
    return <UserOptions UserName={props.UserName} />;
  } else return <GuestOptions />;
};

export default AccountMenu;
