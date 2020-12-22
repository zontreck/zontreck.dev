import React, { useState } from "react";
import { Breadcrumb, Card, Form, Col, Button, Modal } from "react-bootstrap";
import { Memory } from "../MemorySingleton.js";

import { v4 as uuidv4 } from "uuid";
import { useToasts } from "react-toast-notifications";

const OpenSimManager = (props) => {
  const { addToast } = useToasts();
  const mem = new Memory();
  const [createWindow, setCreateWindow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(0);
  const [accountID, setUUID] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const toggleCreateWindow = () => {
    setCreateWindow(!createWindow);
  };

  const generate_id = () => {
    return uuidv4();
  };

  const makeAccount = () => {
    setFirstName("First");
    setLastName(0);
    setUUID(generate_id);
    setAccountPassword("");
    setResetToken(generate_id);

    setCreateWindow(true);
  };

  const doRegister = () => {
    addToast("Creating account : " + firstName + " " + lastName, {
      appearance: "error",
      autoDismiss: true,
      autoDismissTimeout: 5000,
    });

    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/OpenSim/Register.php",
      false
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params =
      "first=" +
      encodeURI(firstName) +
      "&last=" +
      encodeURI(lastName) +
      "&id=" +
      encodeURI(accountID) +
      "&pass=" +
      encodeURI(accountPassword) +
      "&token=" +
      encodeURI(resetToken);
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var par = xhr.responseText.split(";;");
        if (par[0] == "Register") {
          if (par[1] == "OK") {
            addToast("Account Created", {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            });
          } else if (par[1] == "FAIL") {
            addToast("Account not created", {
              appearance: "error",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            });
          }

          toggleCreateWindow();
        }
      }
    });
    xhr.send(params);
  };

  return (
    <div>
      <center>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
          <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
          <Breadcrumb.Item active>OpenSim</Breadcrumb.Item>
        </Breadcrumb>

        <Card
          className="bg-dark text-white"
          style={{ width: "75vw", height: "75vh" }}
        >
          <Card.Header>OpenSimulator Manager</Card.Header>
          <Card.Body>
            <Form>
              <Form.Row>
                <Form.Label sm="6">Need a new account?</Form.Label>
                <Col sm="5">
                  <Button variant="success" onClick={makeAccount}>
                    Create an Account
                  </Button>
                </Col>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="6">Password Reset</Form.Label>
                <Col sm="5">
                  <Button variant="danger">Reset Password</Button>
                </Col>
              </Form.Row>
              {mem.Level >= 3 && (
                <Form.Row>
                  <Form.Label sm="6">User Account Management</Form.Label>
                  <Col sm="5">
                    <Button variant="success">Manager</Button>
                  </Col>
                </Form.Row>
              )}
            </Form>
          </Card.Body>
        </Card>
        <Modal size="lg" onHide={toggleCreateWindow} show={createWindow}>
          <Modal.Header closeButton>
            <Modal.Title>Register Account</Modal.Title>{" "}
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Label sm="2">Account UUID: {accountID}</Form.Label>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">First Name</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </Col>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">Last Name</Form.Label>
                <Col sm="8">
                  {" "}
                  <Form.Control
                    as="select"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  >
                    <option>Select a last Name</option>
                    <option>Apple</option>
                    <option>ShiverSpring</option>
                    <option>Soupmaker</option>
                    <option>Security</option>
                    <option>Son</option>
                    <option>Storyteller</option>
                    {mem.Level >= 4 && <option>SuperSpell</option>}
                    {mem.Level >= 5 && <option>SillySpring</option>}
                  </Form.Control>
                </Col>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">Password</Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                  ></Form.Control>
                </Col>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">Reset Token (write this down): </Form.Label>
                <Col sm="8">
                  <Form.Label>{resetToken}</Form.Label>
                </Col>
              </Form.Row>
              <br />
              <Form.Row>
                <Form.Label>
                  Because we do not use emails on this grid, if you forget your
                  password, you will need your reset token or to email the
                  system admin @{" "}
                  <a href="mailto:tarapiccari@gmail.com">
                    Administrator : tarapiccari@gmail.com
                  </a>
                  <br />
                  Your Account ID and Reset Token are generated the moment you
                  open this form, however they are not saved until you complete
                  the account registration process.
                  <br />
                  <br />
                  If you would like to request custom last names to be added to
                  our list, you may put in a request with the system
                  administrator. This list is only rotated every so often. It is
                  not maintained on a regular basis.
                </Form.Label>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={toggleCreateWindow}>
              Cancel
            </Button>{" "}
            <Button variant="primary" onClick={doRegister}>
              Register Account
            </Button>
          </Modal.Footer>
        </Modal>
      </center>
    </div>
  );
};

export default OpenSimManager;
