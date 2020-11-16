import React, { useState } from "react";
import {
  Breadcrumb,
  Card,
  Tabs,
  Tab,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const ChangePasswordPage = (props) => {
  const { addToast } = useToasts();
  var oldPwd = "";
  var newPwd = "";

  const handleOldChange = (e) => {
    oldPwd = e.target.value;
  };

  const handleNewChange = (e) => {
    newPwd = e.target.value;
  };

  const changePassword = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/ChangeAccountPassword.php",
      false
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");
        if (data[0] == "ChangeAccountPassword") {
          if (data[1] == "0") {
            addToast("Your password has been updated. You must login again.", {
              appearance: "success",
            });
            setTimeout(() => {
              window.location = "/logout";
            }, 5000);
          } else if (data[1] == "1") {
            addToast("You must be logged in to change your password.", {
              appearance: "error",
            });
            setTimeout(() => {
              window.location = "/login";
            }, 2500);
          } else if (data[1] == "2") {
            addToast("Authentication failure with the old password", {
              appearance: "error",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            });
          }
        }
      }
    });
    var params = "oldPwd=" + oldPwd + "&newPwd=" + newPwd;
    xhr.send(params);
  };
  return (
    <div>
      <center>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
          <Breadcrumb.Item active>Change Password</Breadcrumb.Item>
        </Breadcrumb>

        <Card style={{ width: "32rem", color: "#00a7a7", textAlign: "left" }}>
          <Card.Header>
            <h4>Change Password</h4>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <Form>
                <Form.Group>
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Your current Zontreck.dev Password"
                    onChange={handleOldChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Not your SL password"
                    onChange={handleNewChange}
                  />
                  <Form.Text className="text-muted">
                    * Note: Not your Second Life password
                  </Form.Text>
                  <strong>
                    Do not ever use your Second Life password to create accounts
                    on other systems.
                  </strong>
                </Form.Group>
              </Form>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button variant="danger" href="/account">
              Cancel
            </Button>{" "}
            <Button variant="primary" onClick={changePassword}>
              Submit
            </Button>
          </Card.Footer>
        </Card>
      </center>
    </div>
  );
};

export default ChangePasswordPage;
