import React, { useState } from "react";
import { Button, Form, FormText, Col, Card } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Toasty from "./Toasty.js";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };

    this.handleUser = this.handleUser.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.doLogin = this.doLogin.bind(this);
  }

  handleUser(event) {
    this.setState({ username: event.target.value });
  }

  handlePass(event) {
    this.setState({ password: event.target.value });
  }

  goHome() {
    window.location = "/";
  }

  doLogin() {
    // Create HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/LoginAccount.php",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var params = "user=" + this.state.username + "&pwd=" + this.state.password;

    xhr.addEventListener("load", () => {
      console.log("Ready state has changed. New state: " + xhr.readyState);
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");

        if (data[0] == "LoginAccount") {
          if (data[1] == "0") {
            Toasty({
              msg: "No Such Account",
              etc: {
                appearance: "error",
                autoDismiss: true,
                autoDismissTimeout: 10000,
              },
            });
          } else if (data[1] == "1") {
            Toasty({
              msg: "Password incorrect",
              etc: {
                appearance: "error",
                autoDismiss: true,
                autoDismissTimeout: 10000,
              },
            });
          } else {
            var opts = data[1].split(";");
            if (opts[0] == "ok") {
              setTimeout(() => {
                this.goHome();
              }, 5000);
              Toasty({
                msg: "Login Success. You now have authority level: " + opts[1],
                etc: {
                  appearance: "success",
                  autoDismiss: true,
                  autoDismissTimeout: 15000,
                },
              });
            }
          }
        }
      }
    });

    xhr.send(params);
  }

  render() {
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
                      onChange={this.handleUser}
                      value={this.state.username}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>PASSWORD</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Your password"
                      onChange={this.handlePass}
                      value={this.state.password}
                    />
                    <Form.Text className="text-muted">
                      Never share your password with anyone, even an authorized
                      user. Our system allows designation of managers for
                      stores.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group>
                    <Button variant="danger" onClick={this.goHome}>
                      Cancel
                    </Button>
                    {"    "}
                    <Button variant="primary" onClick={this.doLogin}>
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
  }
}

export default LoginPage;
