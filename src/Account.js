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
import Search from "./Search.js";
import ProductsTab from "./ProductsTab.js";
import { Memory } from "./MemorySingleton.js";

const AccountPage = (props) => {
  // Grab the user name, and level from the session data.
  const { addToast } = useToasts();
  const [UserName, setUser] = useState("");
  const [Level, setLevel] = useState(-2);
  const unixTime = () => {
    return Math.floor(Date.now() / 1000);
  };
  const [notifMaker, setNotifMaker] = useState(false);
  const toggleNotificationModal = () => setNotifMaker(!notifMaker);
  const [impersonate, setImpersonate] = useState(false);
  const mem = new Memory();

  var tmpUser = "";
  var xhr = new XMLHttpRequest();
  const processHTTP = () => {
    if (xhr.readyState === 4) {
      var data = xhr.responseText.split(";;");
      if (data[0] == "LoginSessionData") {
        if (data[1] == "impersonation") {
          if (data[2] == "n/a/n") {
            setTimeout(() => {
              setImpersonate(false);
            }, 2500);
          } else {
            setTimeout(() => {
              setImpersonate(true);
            }, 2500);
          }
          mem.Impersonate = impersonate;
          setUser(mem.User);
          setLevel(mem.Level);
        }
      } else if (data[0] == "AdminActions") {
        if (data[1] == "2") {
          addToast("Impersonation is not active", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 5000,
          });
          setTimeout(() => {
            setImpersonate(false);
            mem.Impersonate = false;
          }, 5000);
        } else if (data[1] == "3") {
          addToast("Impersonation has ended", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 2500,
          });
          setTimeout(() => {
            mem.Impersonate = false;
            window.location = "/account";
          }, 5000);
        }
      }
    }
  };
  const rankName = () => {
    if (Level == -1) return "Account Suspended";
    else if (Level == 0) return "Account Not Verified";
    else if (Level == 1) return "User";
    else if (Level == 2) return "Customer";
    else if (Level == 3) return "ZNI Support";
    else if (Level == 4) return "ZNI Operator";
    else if (Level == 5) return "ZNI Owners";
  };
  const runSessionFetch = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/SessionsData.php?var=impersonation&action=get",
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();
  };

  const [deletePrompt, setDeletePrompt] = useState(false);
  const toggleDeletePrompt = () => setDeletePrompt(!deletePrompt);

  const deleteAction = () => {
    if (impersonate) {
      deimpersonate();
      return;
    }
    xhr = new XMLHttpRequest();
    addToast(
      "You are being logged out due to your account having been deleted.",
      {
        appearance: "success",
      }
    );
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/RegisterAccount.php?ACTION=ResetUser&user=" +
        UserName,
      false
    );
    xhr.send();

    setTimeout(() => {
      window.location = "/logout";
    }, 5000);
  };

  const [noticeText, setNoticeText] = useState("");
  const handleNoticeText = (e) => {
    setNoticeText(e.target.value);
  };
  const [noticeMinutes, setNoticeMinutes] = useState(30);
  const handleNoticeMinutes = (e) => {
    setNoticeMinutes(Number(e.target.value));
  };

  const [noticeDuration, setNoticeDuration] = useState(5);
  const handleNoticeDuration = (e) => {
    setNoticeDuration(Number(e.target.value));
  };

  const [noticeColor, setNoticeColor] = useState("");
  const handleNoticeColor = (e) => {
    setNoticeColor(e.target.value);
  };

  const translateNoticeColor = () => {
    if (noticeColor == "Green") return "success";
    else return "error";
  };

  const deimpersonate = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/AdminActions.php?type=deimpersonate",
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();
  };

  const doMakeNotification = () => {
    // Send the notification data to the server then close this Form

    xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/zni/MakeNotification.php",
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
      translateNoticeColor();
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
        {Level == -2 && runSessionFetch()}
        <Card style={{ width: "64rem", color: "#00a5a5" }}>
          <Card.Body>
            <Card.Title>{UserName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Rank: {rankName()}
            </Card.Subtitle>
            <Card.Text style={{ color: "black" }}>
              {impersonate && (
                <Button variant="primary" onClick={() => deimpersonate()}>
                  Deimpersonate
                </Button>
              )}
              <Tabs defaultActiveKey="home">
                {Level >= 1 && (
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
                            <Button
                              variant="danger"
                              onClick={toggleDeletePrompt}
                            >
                              Delete It
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Tab>
                )}
                {Level >= 2 && (
                  <Tab eventKey="products" title="Products">
                    <br />
                    <ProductsTab />
                  </Tab>
                )}
                {Level >= 3 && (
                  <Tab eventKey="search" title="Search">
                    <br />
                    <Search />
                  </Tab>
                )}
                {Level >= 4 && (
                  <Tab eventKey="admin" title="Operations">
                    <br />
                    <strong>
                      This tool allows you to perform various operator actions
                      on the ZNI website. Please use caution.
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
            data, you will need to contact ZNI Support.
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
                  value={noticeText}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Total Minutes</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="30"
                  onChange={handleNoticeMinutes}
                  value={noticeMinutes}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Notice Duration (Seconds)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="5"
                  onChange={handleNoticeDuration}
                  value={noticeDuration}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Notice Color</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue="Choose .."
                  onChange={handleNoticeColor}
                  value={noticeColor}
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
