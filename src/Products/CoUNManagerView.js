import React, { useState } from "react";
import { Memory } from "../MemorySingleton.js";
import {
  Button,
  Form,
  Card,
  Breadcrumb,
  Modal,
  Col,
  Table,
  Image,
  Spinner,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { v4 as uuidv4 } from "uuid";

const CoUNManagerView = (props) => {
  const mem = new Memory();
  const newDeck = () => {
    setNewDeck(!newDeckx);
  };
  const [downloadDone, setDownloadDone] = useState(false);
  const [decks, setDecks] = useState([]);
  const [newDeckx, setNewDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  var xhr = null;
  const doDownload = () => {
    if (downloadDone) return;

    setDownloadDone(true);
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/Modify_Card.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");
        if (data[0] == "List_Decks") {
          setDecks(data[1].split("~"));
        }
      }
    });
    var params = "TYPE_OVERRIDE=LIST_DECKS";

    xhr.send(params);
  };

  const refresh = () => {
    setDownloadDone(false);
    doDownload();
  };

  doDownload();

  const renderDecks = (entry, index) => {
    // Renders the deck list!
    return (
      <tr>
        <td>{entry}</td>
        <td>
          <Button href={"/account/products/coun_manager/" + entry}>Edit</Button>{" "}
          <Button
            href={"/account/products/coun_manager/" + entry + "/script"}
            variant="danger"
          >
            Get Script
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
        <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
        <Breadcrumb.Item active>Cards of Utter Nonsense</Breadcrumb.Item>
      </Breadcrumb>
      <center>
        <br />
        <div style={{ width: "50vw", height: "50vh" }}>
          <Card className="bg-dark text-white">
            <Card.Title>
              Cards of Utter Nonsense - ZNI Edition
              <br />
              Administrative Console
              <div
                style={{
                  width: "25%",
                  height: "50%",
                  position: "absolute",
                  right: 0,
                  top: 10,
                }}
              >
                <Button variant="info" onClick={newDeck}>
                  Create New Deck
                </Button>
              </div>
              <div
                style={{
                  width: "25%",
                  height: "50%",
                  position: "absolute",
                  left: 0,
                  top: 10,
                }}
              >
                <Button
                  variant="danger"
                  href={"/account/products/coun_manager/_a/games/edit"}
                >
                  Edit Active Games
                </Button>
              </div>
            </Card.Title>
            <Card.Body>
              <br />
              <Table hover variant="dark">
                <thead>
                  <tr>
                    <th>Deck Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!downloadDone && refresh()}
                  {decks.map(renderDecks)}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <Modal size="lg" show={newDeckx} onHide={newDeck}>
            <Modal.Header closeButton>
              <h3>
                <b>New Deck Wizard</b>
              </h3>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Row>
                  {" "}
                  <Form.Label sm="2">Deck Name: </Form.Label>
                  <Col sm="6">
                    <Form.Control
                      type="text"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Form.Label sm="2">
                    * NOTE * This deck will not be saved yet after clicking
                    submit, you will be forwarded to the deck editor, after
                    creating at least one card, it will appear in the table on
                    the Deck List
                  </Form.Label>
                </Form.Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                href={"/account/products/coun_manager/" + newDeckName}
                variant="success"
              >
                Edit
              </Button>{" "}
              <Button onClick={newDeck} variant="danger">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </center>
    </div>
  );
};

export default CoUNManagerView;
