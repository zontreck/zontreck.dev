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

const ParticleEditorView = (props) => {
  const [URLStr, setURLStr] = useState("");

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
        <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
        <Breadcrumb.Item active>Particle Editor</Breadcrumb.Item>
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
            <center>Particle Editor - Inspired by Schmarticles</center>
          </Card.Title>
          <Card.Body>
            <Form>
              <Form.Row>
                <Form.Label>URL: </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="text"
                    value={URLStr}
                    onChange={(e) => setURLStr(e.target.value)}
                  ></Form.Control>
                </Col>
              </Form.Row>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Button href="/account" variant="danger">
              Cancel
            </Button>{" "}
            <Button
              href={"/account/products/particle/" + encodeURI(btoa(URLStr))}
              variant="success"
            >
              Load Page
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default ParticleEditorView;
