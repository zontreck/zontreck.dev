import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import {
  Button,
  Breadcrumb,
  Card,
  Image,
  Form,
  Col,
  Badge,
  Modal,
} from "react-bootstrap";

const StoreEditor = (props) => {
  const { addToast } = useToasts();
  const [storeName, setStoreName] = useState(props.match.params.storeName);
  const [storeOwner, setOwner] = useState("");
  const [storeManagers, setManagers] = useState("");
  const [myUser, setMyUser] = useState("");
  const [storeLogo, setLogo] = useState("");
  const [DLSessionComplete, setDLComplete] = useState(false);
  const [DLStoreComplete, setDLStoreComplete] = useState(false);

  const [deleteStoreModal, setDeleteStoreModal] = useState(false);
  const toggleDeleteStore = () => setDeleteStoreModal(!deleteStoreModal);

  var xhr = new XMLHttpRequest();
  const processHTTP = () => {
    if (xhr.readyState === 4) {
      var data = xhr.responseText.split(";;");
      if (data[0] == "LoginSessionData") {
        if (data[1] == "user") {
          if (data[2] == "n/a/n") {
            window.location = "/login";
          } else {
            setTimeout(() => {
              setMyUser(data[2]);
            }, 2500);
          }
        }
      } else if (data[0] == "Get_Store") {
        if (data[1] == "0") {
          addToast("Store not found", {
            appearance: "error",
            autoDismiss: false,
          });
          setTimeout(() => {
            window.location = "/account/products/stores";
          }, 5000);
        } else if (data[1] == "2") {
          addToast("Login is required", {
            appearance: "error",
            autoDismiss: false,
          });
          setTimeout(() => {
            window.location = "/login";
          }, 5000);
        } else if (data[1] == "1") {
          var params = data[2].split(";");
          setTimeout(() => {
            setManagers(params[1]);
          }, 1000);
          setTimeout(() => {
            setStoreName(params[0]);
          }, 1500);
          setTimeout(() => {
            setLogo(params[2]);
          }, 2000);
          setTimeout(() => {
            setOwner(params[3]);
          }, 2500);
        }
      } else if (data[0] == "Delete_Store") {
        if (data[1] == "0") {
          addToast("Store Deleted", { appearance: "success" });
          setTimeout(() => {
            window.location = "/account/products/stores";
          }, 5000);
        } else if (data[1] == "1") {
          addToast("Store could not be deleted", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 5000,
          });
          toggleDeleteStore();
        }
      } else if (data[0] == "Save_Store") {
        if (data[1] == "0") {
          addToast("Store Updated", {
            appearance: "success",
            autoDismiss: true,
          });
        } else if (data[1] == "1") {
          addToast("Store Update Failure", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 10000,
          });
        }
      }
    }
  };

  const DLUserSession = () => {
    if (DLSessionComplete) return;

    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/SessionsData.php?action=get&var=user",
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();

    setDLComplete(true);
  };

  const DLStore = () => {
    if (DLStoreComplete) return;

    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/Get_Store.php?name=" +
        encodeURI(storeName),
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();

    setDLStoreComplete(true);
  };

  if (!DLSessionComplete) DLUserSession();

  if (!DLStoreComplete) DLStore();

  const storeManagersAsList = () => {
    return storeManagers.replace(", ", "\n");
  };

  const updateStoreManagerList = (e) => {
    setManagers(e.target.value.replace("\n", ", "));
  };

  const getUserType = () => {
    var badgeColor = "danger";
    var badgeText = "Manager";
    if (myUser == storeOwner) {
      badgeText = "Store Owner";
      badgeColor = "success";
    }

    return (
      <Badge pill variant={badgeColor}>
        {badgeText}
      </Badge>
    );
  };

  const doDeleteStore = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/Delete_Store.php",
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("name=" + encodeURI(storeName));
    addToast("Deletion in progress...", {
      appearance: "success",
      autoDismiss: true,
      autoDismissTimeout: 5000,
    });
  };

  const saveChanges = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/Save_Store.php",
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(
      "name=" +
        encodeURI(storeName) +
        "&managers=" +
        encodeURI(storeManagers) +
        "&logo=" +
        encodeURI(storeLogo) +
        "&originname=" +
        encodeURI(props.match.params.storeName)
    );
    addToast("Updating store...", {
      appearance: "success",
      autoDismiss: true,
      autoDismissTimeout: 5000,
    });
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
        <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
        <Breadcrumb.Item href="/account/products/stores">
          Stores
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{storeName}</Breadcrumb.Item>
      </Breadcrumb>
      <center>
        <Card
          style={{ width: "50vw" }}
          variant="dark"
          className="bg-secondary text-white"
        >
          <Card.Header>
            <Image
              src={"https://secondlife.com/app/image/" + storeLogo + "/3"}
              rounded
            />
            {" " + storeName}
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Row>
                <Form.Label>Store Owner: {storeOwner}</Form.Label>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">My Access Level: </Form.Label>
                <Col sm="2">{getUserType()}</Col>
              </Form.Row>
              {myUser == storeOwner && (
                <Form.Row>
                  {" "}
                  <Form.Label sm="2">Store Name: </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </Col>
                </Form.Row>
              )}
              {myUser == storeOwner && (
                <Form.Row>
                  <Form.Label sm="2">Store Logo: </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      value={storeLogo}
                      onChange={(e) => setLogo(e.target.value)}
                    />
                  </Col>
                </Form.Row>
              )}
              {myUser == storeOwner && (
                <Form.Row>
                  <Form.Label sm="2">Store Managers: </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      as="textarea"
                      value={storeManagersAsList()}
                      onChange={updateStoreManagerList}
                    />
                  </Col>
                </Form.Row>
              )}
            </Form>
          </Card.Body>
          <Card.Footer>
            {myUser == storeOwner && (
              <Button variant="danger" onClick={toggleDeleteStore}>
                Delete Store
              </Button>
            )}{" "}
            {myUser == storeOwner && (
              <Button variant="success" onClick={saveChanges}>
                Save
              </Button>
            )}
          </Card.Footer>
        </Card>
        <Modal show={deleteStoreModal} onHide={toggleDeleteStore}>
          <Modal.Header>Confirmation</Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the store: {storeName}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={toggleDeleteStore}>
              Cancel
            </Button>{" "}
            <Button variant="danger" onClick={doDeleteStore}>
              Delete It
            </Button>
          </Modal.Footer>
        </Modal>
      </center>
    </div>
  );
};

export default StoreEditor;
