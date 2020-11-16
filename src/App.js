import "./App.css";
import Home from "./Home.js";
import RegisterPage from "./RegisterPage.js";
import LoginPage from "./LoginPage.js";
import React, { useState } from "react";
import { Collapse, Nav, Dropdown, Navbar, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import AccountMenu from "./MenuHandlers/AccountMenu.js";
import AccountPage from "./Account.js";
import LogoutPage from "./Logout.js";
import ChangePasswordPage from "./ChangePassword.js";
import ZDevNotifierCheck from "./ZontreckDevNotificationChecks.js";

const App = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  var level = 0;
  var user = "";
  var xhr = new XMLHttpRequest();
  var isLoggedIn = false;
  const processHTTP = () => {
    if (xhr.readyState === 4) {
      var data = xhr.responseText.split(";;");
      if (data[0] == "LoginSessionData") {
        // Data 1 - The variable
        // Data 2 - The value

        if (data[1] == "user") {
          user = data[2];
          if (data[2] === "n/a/n") {
            console.log("No user defined in login state");
            user = "";
            level = -1;
            return;
          }
          xhr = new XMLHttpRequest();
          xhr.addEventListener("load", processHTTP);
          xhr.open(
            "GET",
            "https://api.zontreck.dev/ls_bionics/SessionsData.php?var=level&action=get",
            false
          );
          xhr.send();
        } else if (data[1] == "level") {
          level = Number(data[2]);
          if (data[2] === "n/a/n") {
            console.log("No user level in login state. not logged in");
            level = -1;
            return;
          }
          isLoggedIn = true;
          console.log(
            "You are logged in with level " +
              level +
              " authority\nUsername: " +
              user
          );
        }
      }
    }
  };
  const checkLoginStatus = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/SessionsData.php?var=user&action=get",
      false
    );
    // TODO : Change this to a Promise so the nesting is not as bad to avoid duplicated requests
    xhr.addEventListener("load", processHTTP);
    xhr.send();
  };

  checkLoginStatus();

  return (
    <div class="mainApp">
      <Navbar bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand href="/">Zontreck.dev - Home of LS Bionics</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <AccountMenu UserName={user} IsLoggedIn={isLoggedIn} />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <ToastProvider PlacementType="top-right">
        <ZDevNotifierCheck />
        <Router>
          <>
            <Route path="/" exact component={Home}></Route>
            <Route path="/register" exact component={RegisterPage}></Route>
            <Route path="/login" exact component={LoginPage}></Route>
            <Route path="/account" exact component={AccountPage}></Route>
            <Route path="/logout" exact component={LogoutPage}></Route>
            <Route
              path="/account/new_password"
              exact
              component={ChangePasswordPage}
            ></Route>
          </>
        </Router>
      </ToastProvider>
    </div>
  );
};

export default App;
