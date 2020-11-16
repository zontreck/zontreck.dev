import React, { useState } from "react";
import { Button, Form, FormText, Col, Card } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const LoginPage = (props) => {
  const { addToast } = useToasts();
  const handleUser = function (e) {
    this.setState(user: e.target.value);
  };

  const handlePwd = function (e) {
    this.setState(pwd: e.target.value);
  };

  const goHome = function () {
    window.location = "/";
  };

  const doLogin = function () {
    // Create HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/LoginAccount.php",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var params = "user=" + user + "&pwd=" + pwd;

    xhr.addEventListener("load", () => {
      console.log("Ready state has changed. New state: " + xhr.readyState);
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");

        if (data[0] == "LoginAccount") {
          if (data[1] == "0") {
            addToast("No such account", {
              appearance: "error",
              autoDismiss: true,
              autoDismissTimeout: 10000,
            });
          } else if (data[1] == "1") {
            addToast("Password incorrect", {
              appearance: "error",
              autoDismiss: true,
              autoDismissTimeout: 10000,
            });
          } else {
            var opts = data[1].split(";");
            if (opts[0] == "ok") {
              setTimeout(() => {
                window.location = "/";
              }, 5000);
              addToast(
                "Login Success. You now have authority level: " + opts[1],
                {
                  appearance: "success",
                  autoDismiss: true,
                  autoDismissTimeout: 15000,
                }
              );
            }
          }
        }
      }
    });

    xhr.send(params);
  };

  return (
    <center>
      <div
        style={{
          width: "50vh",
          height: "50vh",
          top: "25%",
          position: "absolute",
          left: "50vh",
          color: "black",
        }}
      >
        <Card style={{ width: "28rem" }}>
          <Card.Header>
            <strong>Zontreck.dev Login</strong>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              Use this form to login to an existing zontreck.dev account
              <br />
              <br />
              <Form>
                <Form.Group>
                  <Form.Label>SL Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Abcde Resident"
                    onChange={handleUser} value={this.state.user}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>PASSWORD</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Your password"
                    onChange={handlePwd} value={this.state.pwd}
                  />
                  <Form.Text className="text-muted">
                    Never share your password with anyone, even an authorized
                    user. Our system allows designation of managers for stores.
                  </Form.Text>
                </Form.Group>
                <Form.Group>
                  <Button variant="danger" onClick={goHome}>
                    Cancel
                  </Button>
                  {"    "}
                  <Button variant="primary" onClick={doLogin}>
                    Login
                  </Button>
                </Form.Group>
              </Form>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </center>
  );
};

export default LoginPage;
