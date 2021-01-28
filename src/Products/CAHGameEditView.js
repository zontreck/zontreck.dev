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

const CAHGameEditView = (props) => {
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
            <Card.Title>Active Games Editor</Card.Title>
            <Card.Body></Card.Body>
          </center>
        </Card>
      </div>
    </div>
  );
};

export default CAHGameEditView;
