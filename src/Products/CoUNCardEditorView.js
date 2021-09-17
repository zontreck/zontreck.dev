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

const CoUNCardEditorView = (props) => {
  const [downloadDone, setDownloadDone] = useState(false);
  const [cardColor, setCardColor] = useState(0);
  const [cardText, setCardText] = useState("");
  const [cardNum, setCardNum] = useState(0);
  //const [card, setCardTime] = useState(0);

  var xhr = null;
  const doDownload = () => {
    if (downloadDone) return;

    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/CAH_v2_Decks.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var datas = xhr.responseText;
        var DX = JSON.parse(datas);
        setCardColor(Number(DX.Color));
        setCardText(DX.Text);
        setCardNum(Number(DX.Draw));
        setDownloadDone(true);
      }
    });
    var tmp_notation = {};
    tmp_notation.type = "RetrieveCard";
    tmp_notation.ID = props.match.params.cardID;

    var params = JSON.stringify(tmp_notation);
    xhr.send(params);
  };

  doDownload();

  const refresh = () => {
    if (downloadDone) setDownloadDone(false);
    doDownload();
  };

  const newID = () => {
    return uuidv4();
  };

  const uploadCard = () => {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/CAH_v2_Decks.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var tmp_notation = {};
    tmp_notation.type = "UpdateCard";
    tmp_notation.Text = cardText.toString('base64');
    tmp_notation.Color=cardColor;
    tmp_notation.Draw = cardNum;

    var params = JSON.stringify(tmp_notation);
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        if (xhr.responseText === "OK") {
          window.location =
            "/account/products/coun_manager/" + props.match.params.deckName;
        }
      }
    });

    xhr.send(params);
  };

  const deleteCard = () => {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/Modify_Card.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params =
      "DECK=" +
      props.match.params.deckName +
      "&CARD_ID=" +
      props.match.params.cardID +
      "&TYPE_OVERRIDE=DELETE";
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        if (xhr.responseText === "Modify_Card;;ok;delete") {
          window.location =
            "/account/products/cah_manager/" + props.match.params.deckName;
        }
      }
    });
    xhr.send(params);
  };

  const renderOpts = (entry, index) => {
    return (
      <Button variant="primary" onClick={() => setCardNum(entry)}>
        {entry}
      </Button>
    );
  };
  return (
    <div>
      <center>
        <div style={{ width: "75vw", height: "50vh" }}>
          <Card className="bg-dark text-white">
            <Card.Title>CARD EDITOR</Card.Title>
            <Card.Body>
              <div style={{ width: "25vw", height: "50vh" }}>
                <Card
                  bg={cardColor === 0 ? "light" : "secondary"}
                  text={cardColor === 0 ? "black" : "white"}
                  className="mb-2"
                >
                  <Card.Title>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                      <font
                        color={cardColor === 0 ? "black" : "white"}
                        size="6"
                      >
                        {downloadDone && cardText.substr(0, 128)}
                      </font>
                    </pre>
                  </Card.Title>
                  <Card.Body>
                    <pre>
                      <font color={cardColor === 0 ? "black" : "white"}>
                        {downloadDone &&
                          (cardColor === 0
                            ? "Cards of Utter Nonsense"
                            : "Draw (" + cardNum + ")\nPick (" + cardNum + ")")}
                      </font>
                    </pre>
                  </Card.Body>
                  <Card.Footer>
                    <font color={cardColor === 0 ? "black" : "white"}>
                      <Form.Row>
                        <Form.Label sm="2">Card Color: </Form.Label>
                        <Col sm="6">
                          <Button
                            variant="light"
                            onClick={() => setCardColor(0)}
                          >
                            ANSWER
                          </Button>{" "}
                          <Button
                            variant="dark"
                            onClick={() => setCardColor(1)}
                          >
                            QUESTION
                          </Button>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Form.Label sm="2">Card Draw Count: </Form.Label>
                        <Col sm="6">{[0, 1, 2, 3, 4].map(renderOpts)}</Col>
                      </Form.Row>
                      <Form.Row>
                        <Form.Label sm="2">Card Text: </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            as="textarea"
                            value={cardText}
                            onChange={(e) => setCardText(e.target.value)}
                            rows={3}
                          ></Form.Control>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Button variant="primary" onClick={uploadCard}>
                          Confirm Changes
                        </Button>{" "}
                        <Button variant="danger" onClick={deleteCard}>
                          Delete this card
                        </Button>
                        <br />* NOTE * : Deleting a card will only unlink it
                        from this deck
                        <br />* NOTE * : Be careful when editing a card if it
                        resides in more than 1 deck!
                      </Form.Row>
                    </font>
                  </Card.Footer>
                </Card>
              </div>
            </Card.Body>
          </Card>
        </div>
      </center>
    </div>
  );
};

export default CoUNCardEditorView;
