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
import { v4 as uuidv4, v4 } from "uuid";

const CAHGameEditView = (props) => {
  const mem = new Memory();
  const [tableList, setTableList] = useState([]);
  var xhr = null;
  const [downloadDone, setDownloadDone] = useState(false);

  const doDownload = () => {
    if (downloadDone) return;

    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/Modify_Card.php?TYPE_OVERRIDE=LIST_TABLES"
    );
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var dats = xhr.responseText.split(";;");
        if (dats[0] == "List_Tables") {
          // We're good!!
          setTableList(JSON.parse(dats[1]));
          setDownloadDone(true);
        }
      }
    });

    xhr.send();

    setDownloadDone(true);
  };

  doDownload();

  const gen_id = () => {
    return new v4();
  };

  const refresh = () => {
    setDownloadDone(false);
    doDownload();
  };

  const deleteGame = (ID) => {
    // triggers a delete of the game ID
    xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.zontreck.dev/zni/Modify_Card.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        if (xhr.responseText == "Delete_Game;;ok") {
          refresh();
        }
      }
    });
    xhr.send("TYPE_OVERRIDE=DELETE_GAME&TABLE_ID=" + ID);
  };

  const renderTableList = (entry, index) => {
    return (
      <tr>
        <td>{entry.Owner}</td>
        <td>{entry.ID}</td>
        <td>
          <Button
            href={"/account/products/cah_manager/_a/games/edit/" + entry.ID}
            variant="success"
          >
            Edit Game
          </Button>{" "}
          <Button
            onClick={() => {
              deleteGame(entry.ID);
            }}
            variant="danger"
          >
            DELETE GAME
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
        <Breadcrumb.Item href="/account/products/cah_manager">
          Cards Against Humanity
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Active Game Editor</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          width: "50vw",
          height: "75vh",
          position: "absolute",
          top: "15vh",
          left: "25vw",
        }}
      >
        <Card size="lg" className="bg-dark text-light">
          <center>
            <Card.Title>
              Active Games Editor - {downloadDone && tableList.length}
            </Card.Title>
            <Card.Body>
              <Table hover variant="dark">
                <thead>
                  <tr>
                    <th>Table Owner</th>
                    <th>Table ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!downloadDone && refresh()}
                  {downloadDone && tableList.map(renderTableList)}
                </tbody>
              </Table>
            </Card.Body>
          </center>
        </Card>
      </div>
    </div>
  );
};

export default CAHGameEditView;
