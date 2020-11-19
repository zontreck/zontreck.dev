import React, { useState } from "react";
import {
  Button,
  Form,
  Card,
  Breadcrumb,
  Modal,
  Col,
  Image,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const StoreProductsView = (props) => {
  const [storeName, setStoreName] = useState(props.match.params.storeName);
  const [storeOwner, setStoreOwner] = useState("");
  const [DLUserComplete, setDLUserComplete] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productTexture, setProductTexture] = useState("");
  const [productEditor, setProductEditorVisible] = useState(false);
  const [productDescription, setProductDescription] = useState("");

  const toggleProductEditor = () => setProductEditorVisible(!productEditor);

  var xhr = new XMLHttpRequest();

  const processHTTP = () => {
    if (xhr.readyState === 4) {
      var datas = xhr.responseText.split(";;");
      if (datas[0] == "Get_Store") {
        if (datas[1] == "1") {
          var dx = datas[2].split(";");

          setTimeout(() => {
            setStoreName(dx[0]);
          }, 1000);
          setTimeout(() => {
            setStoreOwner(dx[3]);
          }, 1500);
        }
      }
    }
  };
  const DLUser = () => {
    if (DLUserComplete) return;

    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/Get_Store.php?name=" +
        encodeURI(storeName),
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();

    setDLUserComplete(true);
  };

  const newProduct = () => {
    // Open the product editor window
    setTimeout(() => {
      setProductName("New Product");
    }, 1000);

    setTimeout(() => {
      setProductPrice(0);
    }, 1500);

    setTimeout(() => {
      setProductDescription("");
    }, 2000);

    setTimeout(() => {
      setProductTexture("");
    }, 2500);

    setProductEditorVisible(true);
  };

  if (!DLUserComplete) DLUser();

  return (
    <div>
      <center>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
          <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
          <Breadcrumb.Item href="/account/products/stores">
            Stores
          </Breadcrumb.Item>
          <Breadcrumb.Item href={"/account/products/stores/" + storeName}>
            {storeName}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Products Manager</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          className="bg-dark text-white"
          style={{ width: "90vw", height: "75vh", textAlign: "left" }}
        >
          <Card.Header>
            {storeName} - Products Manager
            <Button
              variant="success"
              onClick={newProduct}
              style={{ position: "absolute", right: 0 }}
            >
              +
            </Button>
          </Card.Header>
          <Card.Body></Card.Body>
          <Card.Footer>Store Owner: {storeOwner}</Card.Footer>
        </Card>
        <Modal show={productEditor} onHide={toggleProductEditor}>
          <Modal.Header closeButton>
            Product Editor - {productName}
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Label sm="2">Product Name: </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Col>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">Product Texture: </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    value={productTexture}
                    onChange={(e) => setProductTexture(e.target.value)}
                  />
                </Col>
              </Form.Row>
              <Form.Row>
                <Image
                  src={
                    "https://secondlife.com/app/image/" + productTexture + "/2"
                  }
                  rounded
                />
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">Product Price: </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </Col>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">Description</Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                </Col>
              </Form.Row>
            </Form>
          </Modal.Body>
        </Modal>
      </center>
    </div>
  );
};

export default StoreProductsView;
