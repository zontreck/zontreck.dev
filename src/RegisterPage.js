import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button, Form, Col, Modal } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const RegisterPage = (props) => {
  const { addToast } = useToasts();
  const [modal, setModal] = useState(true);
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const toggle = () => {
    setModal(!modal);
  };

  const handleUser = (event) => {
    setUser(event.target.value);
  };

  const handlePass = (event) => {
    setPass(event.target.value);
  };

  const submitAction = () => {
    console.log("Registering account...");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/RegisterAccount.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params = "user=" + username + "&pwd=" + password;
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
            toggle();

            addToast("Account created you may now login.", {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            });

            setTimeout(() => {
              window.location = "/login";
            }, 5000);
          } else if (data[1] == "1") {
            console.log("Already exists");

            addToast("This account already exists", {
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
            <Form.Row></Form.Row>
            <Form.Group>
              <Form.Label>SL Username (first.last format!)</Form.Label>

              <Form.Control
                type="text"
                size="sm"
                id="sl_username"
                onChange={handleUser}
                placeholder="abcde.resident"
                value={username}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                id="password"
                onChange={handlePass}
                placeholder="Not your SL Password"
                value={password}
              />
            </Form.Group>
            <Form.Group>
              <b>
                Note: Your account level will be Level 1. If you require a
                higher clearance level (ex. ZNI Support), please inform one of
                the managers once your account is created.
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
