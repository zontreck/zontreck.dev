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

const CAHCardEditorView = (props) => {
  const [downloadDone, setDownloadDone] = useState(false);
  const [cardColor, setCardColor] = useState("0");
  const [cardText, setCardText] = useState("");
  const [cardNum, setCardNum] = useState("0");
  //const [card, setCardTime] = useState(0);

  var xhr = null;
  const doDownload = () => {
    if (downloadDone) return;

    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/Modify_Card.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var datas = xhr.responseText.split(";;");
        if (datas[0] == "Fetch_Card") {
          var data = JSON.parse(datas[1]);
          setCardColor(data.Color);
          setCardText(data.Text);
          setCardNum(data.Num);
          //setCardTime(data.Time);
          setDownloadDone(true);
        }
      }
    });

    var params =
      "TYPE_OVERRIDE=FETCH&DECK=" +
      props.match.params.deckName +
      "&CARD_ID=" +
      props.match.params.cardID;
    xhr.send(params);
  };

  doDownload();

  const renderCardList = (entry, index) => {
    var colorStr = "white";
    if (entry.Color == 0) colorStr = "White";
    else colorStr = "Black";

    if (entry.Color == 0) entry.Num = 0;
    return (
      <tr>
        <td>{entry.Text}</td>
        <td>{colorStr}</td>
        <td>{entry.Num}</td>
        <td>
          <Button
            variant="danger"
            href={
              "/account/products/cah_manager/" +
              props.match.params.deckName +
              "/edit/" +
              entry.ID
            }
          >
            Edit Card
          </Button>
        </td>
      </tr>
    );
  };

  const refresh = () => {
    if (downloadDone) setDownloadDone(false);
    doDownload();
  };

  const newID = () => {
    return uuidv4();
  };

  const uploadCard = () => {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/Modify_Card.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params =
      "DECK=" +
      props.match.params.deckName +
      "&CARD_ID=" +
      props.match.params.cardID +
      "&CARD_TEXT=" +
      btoa(cardText) +
      "&COLOR=" +
      cardColor +
      "&DRAW_COUNT=" +
      cardNum;
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        if (xhr.responseText === "Modify_Card;;ok;update") {
          window.location =
            "/account/products/cah_manager/" + props.match.params.deckName;
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
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
        <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
        <Breadcrumb.Item href="/account/products/cah_manager">
          Cards Against Humanity
        </Breadcrumb.Item>
        <Breadcrumb.Item
          href={"/account/products/cah_manager/" + props.match.params.deckName}
        >
          {props.match.params.deckName}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          Card Edit - {props.match.params.cardID}
        </Breadcrumb.Item>
      </Breadcrumb>
      <center>
        <div style={{ width: "75vw", height: "50vh" }}>
          <Card className="bg-dark text-white">
            <Card.Title>CARD EDITOR</Card.Title>
            <Card.Body>
              <div style={{ width: "25vw", height: "50vh" }}>
                <Card
                  bg={cardColor === "0" ? "light" : "secondary"}
                  text={cardColor === "0" ? "black" : "white"}
                  className="mb-2"
                >
                  <Card.Title>
                    <pre>
                      <font
                        color={cardColor === "0" ? "black" : "white"}
                        size="6"
                      >
                        {downloadDone && cardText.substr(0, 128)}
                      </font>
                    </pre>
                  </Card.Title>
                  <Card.Body>
                    <pre>
                      <font color={cardColor === "0" ? "black" : "white"}>
                        {downloadDone &&
                          (cardColor === "0"
                            ? "Cards Against Humanity"
                            : "Draw (" + cardNum + ")\nPick (" + cardNum + ")")}
                      </font>
                    </pre>
                  </Card.Body>
                  <Card.Footer>
                    <font color={cardColor === "0" ? "black" : "white"}>
                      <Form.Row>
                        <Form.Label sm="2">Card Color: </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            type="number"
                            value={cardColor}
                            onChange={(e) => setCardColor(e.target.value)}
                          ></Form.Control>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Form.Label sm="2">Card Draw Count: </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            type="number"
                            value={cardNum}
                            onChange={(e) => setCardNum(e.target.value)}
                          ></Form.Control>
                        </Col>
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

export default CAHCardEditorView;
