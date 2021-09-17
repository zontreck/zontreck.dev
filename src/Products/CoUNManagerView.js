import React, { useState } from "react";
import { Memory } from "../MemorySingleton.js";
import {
  Button,
  Form,
  Card,
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
    xhr.open("POST", "https://api.zontreck.dev/zni/CAH_v2_Decks.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText;
        var notation = JSON.parse(data);
        setDecks(notation);
      }
    });
    var tmp_notation = {};
    tmp_notation.type = "ListAllDecks";
    var params = JSON.stringify(tmp_notation);

    xhr.send(params);
  };

  const refresh = () => {
    setDownloadDone(false);
    doDownload();
  };

  const doMakeDeck = () => {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/CAH_v2_Decks.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText;
        if (data == "CAHv2Decks;;OK;") {
          setNewDeck(false);
          refresh();
        }
      }
    });
    var tmp_notation = {};
    tmp_notation.type = "MakeDeck";
    tmp_notation.user = mem.User;
    tmp_notation.deck = newDeckName;
    var params = JSON.stringify(tmp_notation);

    xhr.send(params);
  };

  doDownload();

  const renderDecks = (entry, index) => {
    // Renders the deck list!
    return (
      <tr>
        <td>{entry.Name}</td>
        <td>{entry.Owner}</td>
        <td>
          {(entry.Type == 2 && "Table Deck") ||
            (entry.Type == 1 && "In-Prog Deck") ||
            (entry.Type == 0 && "Default / Publicly Available")}
        </td>
        <td>
          <Button href={"/account/products/coun_manager/" + entry.Name}>
            Edit
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div>
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
                  height: "10%",
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
                  height: "10%",
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
              <div
                style={{
                  width: "25%",
                  height: "10%",
                  position: "absolute",
                  left: "0%",
                  top: 50,
                }}
              >
                <Button
                  variant="danger"
                  href={"/account/products/coun_manager/_a/cards/edit"}
                >
                  Card Database
                </Button>
              </div>
            </Card.Title>
            <Card.Body>
              <br />
              <Table hover variant="dark">
                <thead>
                  <tr>
                    <th>Deck Name</th>
                    <th>Deck Owner</th>
                    <th>Deck Type</th>
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
                    * NOTE * <br />
                    This deck will be created but may have no cards. You will
                    need to open the deck's editor to add cards.
                    <br />
                    <br />
                    The deck will be assigned as a In-Prog deck by default as it
                    cannot be a table deck, nor an official deck.
                    <br />
                    <br />
                    Only developer clearance can modify this value
                  </Form.Label>
                </Form.Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={doMakeDeck}>
                Create
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
