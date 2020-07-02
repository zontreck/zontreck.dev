import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "./logo.svg";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
const HDR = (props) => {
  const { location } = props;

  return (
    <Navbar
      bg="dark"
      variant="dark"
      style={{ position: "fixed", zIndex: 100, top: 0, width: "100%" }}
    >
      <Navbar.Brand href="/">
        <img
          alt=""
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        Zontreck/dev
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responseive-navbar-nav">
        <Nav className="mr-auto" activeKey={location.pathname}>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About Me</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
const HeaderWithRouter = withRouter(HDR);

function ZDevNavBar() {
  return (
    <>
      <Router>
        <>
          <HeaderWithRouter></HeaderWithRouter>
        </>
      </Router>
    </>
  );
}

export default ZDevNavBar;
