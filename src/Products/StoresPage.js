import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import {
  Button,
  Form,
  Card,
  Table,
  Badge,
  Modal,
  Col,
  Image,
  Breadcrumb,
} from "react-bootstrap";

const StoresPage = () => {
  const { addToast } = useToasts();
  const [storeTable, setStoreTable] = useState([]);
  const [hasStoreTable, setHasStoreTable] = useState(false);
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [createStoreModal, setCreateStoreModal] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [renderedStoreTable, setRenderedStoreTable] = useState(false);
  const createStoreToggle = () => {
    setCreateStoreModal(!createStoreModal);
  };
  const openStore = (e) => {
    window.location = "/account/products/stores/" + encodeURI(e);
  };
  const submitNewStore = () => {
    var params =
      "name=" + encodeURI(storeName) + "&logo=" + encodeURI(selectedFile);

    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/zni/Create_Store.php",
      true
    );
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");
        if (data[0] == "Create_Store") {
          if (data[1] == "0") {
            addToast("Store created", {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            });
            createStoreToggle();
            setTimeout(() => {
              window.location = "/account/products/stores";
            }, 2500);
          } else if (data[1] == "1") {
            addToast("Store could not be created", {
              appearance: "error",
              autoDismiss: true,
              autoDismissTimeout: 2500,
            });
          } else if (data[1] == "2") {
            addToast("You must be logged in", {
              appearance: "error",
              autoDismiss: false,
            });
            setTimeout(() => {
              window.location = "/login";
            }, 5000);
          }
        }
      }
    });
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  };
  const createStoreTable = () => {
    var retData = [];
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/List_Stores.php",
      false
    );
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");
        for (var i = 1; i < data.length; i++) {
          var entry = data[i].split(";");
          if (data[i] == "") return;
          for (var i = 0; i < entry.length; i++) {
            var theData = entry[i].split("~");
            var badgeColor = "";
            var badgeText = "";
            if (theData[1] == "n") {
              badgeColor = "danger";
              badgeText = "Manager";
            } else {
              badgeColor = "success";
              badgeText = "Owner";
            }
            retData.push({
              store: theData[0],
              color: badgeColor,
              text: badgeText,
              logo: theData[2],
            });

            console.log(
              "Stores entry: " +
                theData +
                ";;;;" +
                badgeText +
                "~" +
                badgeColor +
                "~" +
                theData[0]
            );
          }
        }
      }
    });

    xhr.send();

    setStoreTable(retData);
    if (!hasStoreTable) setHasStoreTable(true);
  };

  const renderStores = (entry, index) => {
    //console.log("Entry render: " + JSON.stringify(entry));
    return (
      <tr key={index}>
        <td>
          <Image
            src={"https://secondlife.com/app/image/" + entry.logo + "/3"}
            rounded
          />
          {entry.store}{" "}
          <Badge pill variant={entry.color}>
            {entry.text}
          </Badge>
        </td>
        <td>
          <Button
            onClick={() => {
              openStore(entry.store);
            }}
            variant={entry.color}
          >
            Open
          </Button>
        </td>
      </tr>
    );
  };
  const checkLoginStatus = () => {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/SessionsData.php?var=user&action=get",
      false
    );
    setIsLoggedIn(true);
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");
        if (data[0] == "LoginSessionData") {
          if (data[1] == "user") {
            if (data[2] == "n/a/n") {
              window.location = "/login";
            }
          }
        }
      }
    });
    xhr.send();
  };
  return (
    <center>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
        <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
        <Breadcrumb.Item active>Stores</Breadcrumb.Item>
      </Breadcrumb>
      {!IsLoggedIn && checkLoginStatus()}
      <br />
      <div style={{ width: "50vw", height: "50vh" }}>
        <Card className="bg-dark text-white">
          <Card.Title>
            Store System
            <div
              style={{
                width: "50%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
              }}
            >
              <Button variant="info" onClick={createStoreToggle}>
                Create New Store
              </Button>
            </div>
          </Card.Title>
          <Card.Body>
            <br />
            <Table hover variant="dark">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {!hasStoreTable && createStoreTable()}
                {storeTable.map(renderStores)}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
      <Modal show={createStoreModal} onHide={createStoreToggle}>
        <Modal.Header closeButton>Create a new Store</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Label sm="2">Store Name: </Form.Label>{" "}
              <Col sm="8">
                <Form.Control
                  type="text"
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Label sm="2">Store Logo UUID: </Form.Label>{" "}
              <Col sm="8">
                <Form.Control
                  type="text"
                  onChange={(e) => setSelectedFile(e.target.value)}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Label sm="2">Preview: </Form.Label>
              <Col sm="10">
                <Image
                  src={
                    "https://secondlife.com/app/image/" + selectedFile + "/1"
                  }
                  rounded
                />
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={createStoreToggle}>
            Cancel
          </Button>{" "}
          <Button variant="success" onClick={submitNewStore}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </center>
  );
};

export default StoresPage;
