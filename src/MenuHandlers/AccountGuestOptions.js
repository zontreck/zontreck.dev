import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";

const GuestOptions = (props) => {
  return (
    <>
      <NavDropdown.Item href="/register">Register</NavDropdown.Item>

      <NavDropdown.Item href="/login">Login</NavDropdown.Item>
    </>
  );
};

export default GuestOptions;
