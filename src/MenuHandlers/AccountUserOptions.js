import React from "react";
import { NavDropdown, Nav } from "react-bootstrap";

const UserOptions = (props) => {
  return (
    <>
      <NavDropdown.Item href="/account">
        View Account: {props.UserName}
      </NavDropdown.Item>
      <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
    </>
  );
};

export default UserOptions;
