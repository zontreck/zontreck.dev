import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button, Form, Col, Modal } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const RegisterPage = (props) => {
  const { addToast } = useToasts();
  const { className } = props;
  const [modal, setModal] = useState(true);
  const toggle = () => setModal(!modal);
  const thisMainPage = this;

  const handleUserChange = function (e) {
    this.setState(sl_username: e.target.value);
  };
  const handleEmailChange = function (e) {
    this.setState(sl_email: e.target.value);
  };
  const handleTokenChange = function (e) {
    this.setState(token: e.target.value);
  };

  const handlePwdChange = function (e) {
    this.setState(pwd: e.target.value);
  };

  const submitAction = () => {
    if (this.state.sl_username !== null) {
      var user = this.state.sl_username;
      if (this.state.sl_email !== null) {
        var email = this.state.sl_email;
        if (this.state.token !== null) {
          var z_token = this.state.token;
          if (this.state.pwd !== null) {
            var z_pwd = this.state.pwd;
            console.log("Registering account...");
            var xhr = new XMLHttpRequest();
            xhr.open(
              "POST",
              "https://api.zontreck.dev/ls_bionics/RegisterAccount.php",
              true
            );
            xhr.setRequestHeader(
              "Content-Type",
              "application/x-www-form-urlencoded"
            );
            var params =
              "user=" +
              user +
              "&email=" +
              email +
              "&token=" +
              z_token +
              "&pwd=" +
              z_pwd;
            xhr.addEventListener("load", () => {
              console.log(
                "Ready state has changed. New state: " + xhr.readyState
              );
              if (xhr.readyState === 4) {
                // Do something!
                console.log("Request completed: " + xhr.responseText);
                var data = xhr.responseText.split(";;");
                console.log("Data 0: " + data[0]);
                if (data[0] == "RegisterAccount") {
                  console.log(
                    "In- RegisterAccount. Checking for response code"
                  );
                  if (data[1] == "0") {
                    // Display a success message
                    console.log("Approval for account");
                    setModal(false);
                    addToast("Account Created! You may now login", {
                      appearance: "success",
                      autoDismiss: true,
                      autoDismissTimeout: 10000,
                    });
                  } else if (data[1] == "1") {
                    setModal(false);
                    console.log("Already exists");
                    addToast("This account already exists", {
                      appearance: "error",
                      autoDismiss: true,
                      autoDismissTimeout: 5000,
                    });
                  } else if (data[1] == "2") {
                    setModal(false);
                    console.log("No token");
                    addToast(
                      "You must request an authorization token from our store.",
                      {
                        appearance: "error",
                        autoDismiss: true,
                        autoDismissTimeout: 15000,
                      }
                    );
                  } else if (data[1] == "3") {
                    console.log("Error, token invalid");
                    addToast("Your token does not match our records!", {
                      appearance: "error",
                      autoDismiss: true,
                      autoDismissTimeout: 5000,
                    });
                  }
                }
              } else {
                console.log("Request: " + xhr.readyState);
              }
            });

            xhr.send(params);
          }
        }
      }
    }
  };

  return (
    <div>
      <Button color="info" onClick={toggle}>
        Re-show Registration Page
      </Button>
      <div id="toasts"> </div>
      <Modal show={modal} onHide={toggle}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <h3>
                Note that registration for a Zontreck.dev account requires that
                you requested this action from in-world.
              </h3>
            </Form.Row>
            <Form.Group>
              <Form.Label>SL Username</Form.Label>

                <Form.Control
                  type="text"
                  size="sm"
                  id="sl_username"
                  onChange={handleUserChange}
                  placeholder="Abcde Resident" value={this.state.sl_username}
                />
          </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>

                <Form.Control
                  type="email"
                  id="sl_email"
                  onChange={handleEmailChange}
                  placeholder="user@email.net" value={this.state.sl_email}
                />
            <Form.Text className="text-muted">We will never share your email with anyone</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Auth Token</Form.Label>

                <Form.Control
                  type="text"
                  id="sl_auth"
                  onChange={handleTokenChange}
                  placeholder="Authorization Token" value={this.state.token}
                />

        </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>

                <Form.Control
                  type="password"
                  id="password"
                  onChange={handlePwdChange}
                  placeholder="Not your SL Password" value={this.state.pwd}
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
        <Modal.Footer toggle={toggle}>
          <Button variant="danger" onClick={toggle} href="/">
            Cancel
          </Button>{" "}
          <Button variant="primary" onClick={submitAction}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterPage;
