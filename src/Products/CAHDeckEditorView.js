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

const CAHDeckEditorView = (props) => {
  const [downloadDone, setDownloadDone] = useState(false);
  const [cardList, setCardList] = useState([]);

  var xhr = null;
  const doDownload = () => {
    if (downloadDone) return;

    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/Modify_Card.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var datas = xhr.responseText.split(";;");
        if (datas[0] == "List_Cards") {
          setCardList(JSON.parse(datas[1]));
          setDownloadDone(true);
        }
      }
    });

    var params = "TYPE_OVERRIDE=LIST_CARDS&DECK=" + props.match.params.deckName;
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
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
        <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
        <Breadcrumb.Item href="/account/products/cah_manager">
          Cards Against Humanity
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{props.match.params.deckName}</Breadcrumb.Item>
      </Breadcrumb>
      <center>
        <div style={{ width: "75vw", height: "50vh" }}>
          <Card className="bg-dark text-white">
            <Card.Title>
              {props.match.params.deckName} - Editor -{" "}
              {!downloadDone && refresh()}
              {downloadDone && cardList.length} Total Cards
              <Button
                variant="primary"
                style={{ position: "absolute", right: 5, top: 5 }}
                href={
                  "/account/products/cah_manager/" +
                  props.match.params.deckName +
                  "/edit/" +
                  newID()
                }
              >
                New Card
              </Button>
            </Card.Title>
            <Card.Body>
              * Note: This will only list the cards presently in the deck. The
              card editor is on another page, use the card's link to go there
              <br />
              <Table hover variant="dark">
                <thead>
                  <tr>
                    <th>Card Text</th>
                    <th>Card Color</th>
                    <th>Number of Cards</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!downloadDone && refresh()}
                  {downloadDone && cardList.map(renderCardList)}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </center>
    </div>
  );
};

export default CAHDeckEditorView;
