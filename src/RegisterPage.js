import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button, Form, Col, Modal } from "react-bootstrap";
import Toasty from "./Toasty.js";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      token: "",
      password: "",
      modal: false,
    };

    this.handleUser = this.handleUser.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleToken = this.handleToken.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle () {
    this.setState({ toggle: !this.state.modal });
  }

  handleUser(event) {
    this.setState({ username: event.target.value });
  }

  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleToken(event) {
    this.setState({ token: event.target.value });
  }

  handlePass(event) {
    this.setState({ password: event.target.value });
  }

  submitAction() {
    console.log("Registering account...");
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/RegisterAccount.php",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params =
      "user=" +
      this.state.username +
      "&email=" +
      this.state.email +
      "&token=" +
      this.state.token +
      "&pwd=" +
      this.state.password;
    xhr.addEventListener("load", () => {
      console.log("Ready state has changed. New state: " + xhr.readyState);
      if (xhr.readyState === 4) {
        // Do something!
        console.log("Request completed: " + xhr.responseText);
        var data = xhr.responseText.split(";;");
        console.log("Data 0: " + data[0]);
        if (data[0] == "RegisterAccount") {
          console.log("In- RegisterAccount. Checking for response code");
          if (data[1] == "0") {
            // Display a success message
            console.log("Approval for account");
            this.toggle();

            Toasty({
              msg: "Account created you may now login.",
              etc: {
                appearance: "success",
                autoDismiss: true,
                autoDismissTimeout: 5000,
              },
            });
          } else if (data[1] == "1") {
            console.log("Already exists");

            Toasty({
              msg: "This account already exists",
              etc: {
                appearance: "error",
                autoDismiss: true,
                autoDismissTimeout: 5000,
              },
            });
          } else if (data[1] == "2") {
            this.toggle();
            console.log("No token");
            Toasty({
              msg: "You must request a authorization token from our store.",
              etc: {
                appearance: "error",
                autoDismiss: true,
                autoDismissTimeout: 5000,
              },
            });
          } else if (data[1] == "3") {
            console.log("Error, token invalid");
            Toasty({
              msg: "Your token does not match our records",
              etc: {
                appearance: "error",
                autoDismiss: true,
                autoDismissTimeout: 5000,
              },
            });
          }
        }
      } else {
        console.log("Request: " + xhr.readyState);
      }
    });

    xhr.send(params);
  }

  render() {
    return (
      <div>
        <Button color="info" onClick={this.toggle}>
          Re-show Registration Page
        </Button>
        <div id="toasts"> </div>
        <Modal show={this.state.modal} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title>Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <h3>
                  Note that registration for a Zontreck.dev account requires
                  that you requested this action from in-world.
                </h3>
              </Form.Row>
              <Form.Group>
                <Form.Label>SL Username</Form.Label>

                <Form.Control
                  type="text"
                  size="sm"
                  id="sl_username"
                  onChange={this.handleUser}
                  placeholder="Abcde Resident"
                  value={this.state.username}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>

                <Form.Control
                  type="email"
                  id="sl_email"
                  onChange={this.handleEmail}
                  placeholder="user@email.net"
                  value={this.state.email}
                />
                <Form.Text className="text-muted">
                  We will never share your email with anyone
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Auth Token</Form.Label>

                <Form.Control
                  type="text"
                  id="sl_auth"
                  onChange={this.handleToken}
                  placeholder="Authorization Token"
                  value={this.state.token}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>

                <Form.Control
                  type="password"
                  id="password"
                  onChange={this.state.password}
                  placeholder="Not your SL Password"
                  value={this.state.password}
                />
              </Form.Group>
              <Form.Group>
                <b>
                  Note: Your account level will be Level 1. If you require a
                  higher clearance level (ex. LS Bionics Support), please inform
                  one of the managers once your account is created.
                </b>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer toggle={this.toggle}>
            <Button variant="danger" onClick={this.toggle} href="/">
              Cancel
            </Button>{" "}
            <Button variant="primary" onClick={this.submitAction}>
              Register
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default RegisterPage;
