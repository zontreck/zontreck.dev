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
import Highlight from "react-highlight";

const CAHDeckScriptView = (props) => {
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
        <Breadcrumb.Item
          href={"/account/products/cah_manager/" + props.match.params.deckName}
        >
          {props.match.params.deckName}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Deck Ingredient Script</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          width: "75vw",
          height: "50vh",
          position: "absolute",
          left: "15vw",
        }}
      >
        <Card className="bg-dark text-white">
          <Card.Title>
            <center>{props.match.params.deckName} - Script Ingredient</center>
          </Card.Title>
          <Card.Body>
            {props.match.params.deckName == "OFFICIAL" && (
              <center>
                <h1>
                  <a style={{ color: "red" }}>
                    This is the default deck and cannot be uninstalled or
                    installed into a game table
                  </a>
                </h1>
              </center>
            )}
            {props.match.params.deckName != "OFFICIAL" && (
              <Highlight language="lsl" style={{ textAlign: "left" }}>
                {'integer ingredient_channel = -8392888;\ndefault\n{\n    state_entry()\n    {\n        llListen(ingredient_channel, "", "", "");\n        llSetText("Deck of Cards\\n-----\\nQuantity: 1", <0,1,0>,1);\n        llSetObjectDesc("' +
                  props.match.params.deckName +
                  '");\n    }\n    touch_start(integer t){\n        llSay(0, "' +
                  props.match.params.deckName +
                  ' Deck of Cards; Quantity: 1");\n    }\n    on_rez(integer t){\n        llResetScript();\n    }\n    listen(integer c,string n,key i,string m){\n        if(m == "scan"){\n            llSay(c+1, "Deck");\n        }else if(m == (string)llGetKey()){\n            llDie();\n        }\n    }\n}\n'}
              </Highlight>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CAHDeckScriptView;
