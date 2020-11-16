import React, { useState } from "react";
import {
  Breadcrumb,
  Card,
  Tabs,
  Tab,
  Modal,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const AccountPage = (props) => {
  // Grab the user name, and level from the session data.
  const { addToast } = useToasts();

  const unixTime = () => {
    return Math.floor(Date.now() / 1000);
  };
  const [notifMaker, setNotifMaker] = useState(false);
  const toggleNotificationModal = () => setNotifMaker(!notifMaker);

  var UserName = "";
  var Level = -1;
  var xhr = new XMLHttpRequest();
  const processHTTP = () => {
    if (xhr.readyState === 4) {
      var data = xhr.responseText.split(";;");
      if (data[0] == "LoginSessionData") {
        if (data[1] == "user") {
          UserName = data[2];
          if (UserName == "n/a/n") {
            UserName = "";
          }

          xhr = new XMLHttpRequest();
          xhr.open(
            "GET",
            "https://api.zontreck.dev/ls_bionics/SessionsData.php?var=level&action=get",
            false
          );
          xhr.addEventListener("load", processHTTP);
          xhr.send();
        } else if (data[1] == "level") {
          Level = Number(data[2]);
          if (data[2] == "n/a/n") {
            window.location = "/login";
          }
        }
      }
    }
  };
  const rankName = () => {
    if (Level == 1) return "User";
    else if (Level == 2) return "Customer";
    else if (Level == 3) return "LS Support";
    else if (Level == 4) return "LS Operator";
    else if (Level == 5) return "LS Owners";
  };
  xhr.open(
    "GET",
    "https://api.zontreck.dev/ls_bionics/SessionsData.php?var=user&action=get",
    false
  );
  xhr.addEventListener("load", processHTTP);
  xhr.send();

  const [deletePrompt, setDeletePrompt] = useState(false);
  const toggleDeletePrompt = () => setDeletePrompt(!deletePrompt);

  const deleteAction = () => {
    xhr = new XMLHttpRequest();
    addToast(
      "You are being logged out due to your account having been deleted.",
      {
        appearance: "success",
      }
    );
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/RegisterAccount.php?ACTION=ResetUser&user=" +
        UserName,
      false
    );
    xhr.send();

    setTimeout(() => {
      window.location = "/logout";
    }, 5000);
  };

  var noticeText = "";
  const handleNoticeText = (e) => {
    noticeText = e.target.value;
  };
  var noticeMinutes = 30;
  const handleNoticeMinutes = (e) => {
    noticeMinutes = Number(e.target.value);
  };

  var noticeDuration = 5;
  const handleNoticeDuration = (e) => {
    noticeDuration = Number(e.target.value);
  };

  var noticeColor = "";
  const handleNoticeColor = (e) => {
    if (e.target.value == "Green") noticeColor = "success";
    else noticeColor = "error";
  };

  const doMakeNotification = () => {
    // Send the notification data to the server then close this Form
    xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/MakeNotification.php",
      false
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params =
      "msg=" +
      encodeURI(noticeText) +
      "&until=" +
      (unixTime() + noticeMinutes * 60) +
      "&expire=" +
      noticeDuration * 1000 +
      "&color=" +
      noticeColor;
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");
        if (data[0] == "MakeNotification") {
          if (data[1] == "0") {
            toggleNotificationModal();
            addToast("Notification added to the server", {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            });
          } else if (data[1] == "1") {
            addToast(
              "Notification could not be scheduled. You may not have a high enough clearance level",
              {
                appearance: "error",
                autoDismiss: true,
                autoDismissTimeout: 5000,
              }
            );
          }
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
          <Breadcrumb.Item active>Account</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{ width: "64rem", color: "#00a5a5" }}>
          <Card.Body>
            <Card.Title>{UserName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Rank: {rankName()}
            </Card.Subtitle>
            <Card.Text style={{ color: "black" }}>
              <Tabs defaultActiveKey="home">
                <Tab eventKey="home" title="Home">
                  <br />
                  <Table stripped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Changes user password</td>
                        <td>
                          <Button
                            variant="primary"
                            href="/account/new_password"
                          >
                            Change
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td>Deletes your account</td>
                        <td>
                          <Button variant="danger" onClick={toggleDeletePrompt}>
                            Delete It
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="stores" title="Stores">
                  <br />
                  <h2>
                    Your store, and any you are a manager in will appear here.
                  </h2>
                </Tab>
                {Level >= 3 && (
                  <Tab eventKey="search" title="Search">
                    <br />
                    <h2>
                      Take care. This is a administrative tool. You can search
                      for a user and even edit their stores. Please be cautious.
                    </h2>
                  </Tab>
                )}
                {Level >= 4 && (
                  <Tab eventKey="admin" title="Operations">
                    <br />
                    <strong>
                      This tool allows you to perform various operator actions
                      on the LS Bionics website. Please use caution.
                    </strong>
                    <br />
                    <Table stripped bordered hover variant="dark">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            This action will send a site wide notification pop
                            up. Parameters are configurable.
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={toggleNotificationModal}
                            >
                              Show Wizard
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Tab>
                )}
              </Tabs>
            </Card.Text>
          </Card.Body>
        </Card>

        <Modal show={deletePrompt} onHide={toggleDeletePrompt}>
          <Modal.Header closeButton>
            <Modal.Title>
              Are you sure you want to delete your account?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This action will only delete the login data associated with your
            account. If you wish to fully delete your account including all
            data, you will need to contact LS Bionics Support.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={toggleDeletePrompt}>
              Cancel
            </Button>{" "}
            <Button variant="primary" onClick={deleteAction}>
              Yes. Delete it.
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={notifMaker} onHide={toggleNotificationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Notification Creation Wizard</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Notice Text</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="This is the text displayed on the notice"
                  onChange={handleNoticeText}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Total Minutes</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="30"
                  onChange={handleNoticeMinutes}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Notice Duration (Seconds)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="5"
                  onChange={handleNoticeDuration}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Notice Color</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue="Choose .."
                  onChange={handleNoticeColor}
                >
                  <option>Choose ..</option>
                  <option>Green</option>
                  <option>Red</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" onClick={toggleNotificationModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={doMakeNotification}>
              Make Notification
            </Button>
          </Modal.Footer>
        </Modal>
      </center>
    </div>
  );
};

export default AccountPage;
