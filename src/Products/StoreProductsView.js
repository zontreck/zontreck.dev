import React, { useState } from "react";
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

const StoreProductsView = (props) => {
  const { addToast } = useToasts();
  const [storeName, setStoreName] = useState(props.match.params.storeName);
  const [storeOwner, setStoreOwner] = useState("");
  const [DLUserComplete, setDLUserComplete] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productTexture, setProductTexture] = useState("");
  const [productEditor, setProductEditorVisible] = useState(false);
  const [productDescription, setProductDescription] = useState("");
  const [profitSplits, setProfitSplits] = useState([]);
  const [productID, setProductID] = useState("");
  const [productInventory, setProductInventory] = useState([]);
  const [productVendorItem, setVendorItem] = useState("");
  const [productList, setProductList] = useState([]);
  const [DLListComplete, setDLListComplete] = useState(false);

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
      } else if (datas[0] == "Save_Product") {
        if (datas[1] == "0") {
          addToast("Product Update Completed", { appearance: "success" });
          setTimeout(() => {
            window.location =
              "/account/products/stores/" + storeName + "/products";
          }, 2500);
        } else if (datas[1] == "1") {
          addToast("Product Update Failure", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 5000,
          });
        } else if (datas[1] == "2") {
          window.location = "/login";
        }
      } else if (datas[0] == "List_Dropbox_Inventory") {
        setProductInventory(datas[1].split("~^"));
      } else if (datas[0] == "List_Products") {
        var d2 = datas[1].split(";");
        var d4 = [];
        if (datas[1] == "") {
          setProductList([]);
          return;
        }
        for (var i = 0; i < d2.length; i++) {
          var d3 = d2[i].split("~");
          var dx = [];
          dx.price = d3[3];
          dx.description = d3[4];
          dx.productName = d3[2];
          dx.texture = d3[6];
          dx.item = d3[7];
          dx.id = d3[1];

          d4.push(dx);
        }

        setProductList(d4);
      } else if (datas[0] == "Delete_Product") {
        if (datas[1] == "2") window.location = "/login";
        else if (datas[1] == "1") {
          addToast("Failed to Delete product", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 5000,
          });
        } else if (datas[1] == "0") {
          addToast(
            <div>
              <Spinner variant="danger" animation="border" size="sm"></Spinner>
              Product Deleted.. Refreshing
            </div>,
            {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            }
          );
          setTimeout(() => refreshProductList(), 1000);
        }
      } else if (datas[0] == "Get_Product") {
        if (datas[1] == "2") window.location = "/login";
        else if (datas[1] == "1") {
          addToast("Product retrieval failure", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 5000,
          });
        } else if (datas[1] == "0") {
          addToast(
            <div>
              <Spinner variant="danger" animation="border" size="sm"></Spinner>
              Populating product editor
            </div>,
            {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 5000,
            }
          );
          refreshInventoryList();
          var dx = datas[2].split(";");
          setTimeout(() => {
            setProductID(dx[0]);
            setProductName(dx[1]);
            setProductPrice(dx[2]);
            setProfitSplits(JSON.parse(dx[3]));
            setProductTexture(dx[4]);
            setProductDescription(dx[5]);
            setVendorItem(dx[6]);
          }, 1000);

          setTimeout(() => {
            setProductEditorVisible(true);
          }, 5000);
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

  const refreshInventoryList = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/List_DropboxInventory_ByAccount.php?user=" +
        encodeURI(storeOwner),
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();
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

    setTimeout(() => {
      setProfitSplits([{ user: storeOwner, percent: 100 }]);
    }, 3000);

    setTimeout(() => {
      setProductID(generate_id());
    }, 3500);

    setTimeout(() => {
      refreshInventoryList();
    }, 4000);

    setTimeout(() => {
      setVendorItem("Choose ..");
    }, 4500);

    setProductEditorVisible(true);

    addToast(
      <div>
        <Spinner animation="border" variant="danger" size="sm"></Spinner>
        Generating new product data...
      </div>,
      { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 }
    );
  };

  if (!DLUserComplete) DLUser();

  const renderSplits = (entry, index) => {
    return (
      <tr key={index}>
        <td>
          <Form.Control
            type="text"
            value={entry.user}
            onChange={(e) => updateProfitSplit("user", index, e.target.value)}
          ></Form.Control>
        </td>
        <td>
          <Form.Control
            type="text"
            value={entry.percent}
            onChange={(e) =>
              updateProfitSplit("percent", index, e.target.value)
            }
          ></Form.Control>
        </td>
        <td>
          <Button variant="danger" onClick={() => removeProfitSplit(index)}>
            Remove
          </Button>
        </td>
      </tr>
    );
  };

  const updateProfitSplit = (type, index, value) => {
    var split = [...profitSplits];
    if (type == "user") split[index].user = value;
    else if (type == "percent") split[index].percent = value;

    setProfitSplits(split);
  };

  const removeProfitSplit = (index) => {
    var tmp = [...profitSplits];
    tmp.splice(index, 1);
    setProfitSplits(tmp);
  };

  const newProfitSplit = () => {
    var split = [...profitSplits];
    split.push({ user: "", percent: 0 });
    setProfitSplits(split);
  };
  const saveProduct = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/Save_Product.php",
      false
    );
    var params =
      "store=" +
      encodeURI(storeName) +
      "&name=" +
      encodeURI(productName) +
      "&id=" +
      encodeURI(productID) +
      "&price=" +
      encodeURI(productPrice) +
      "&description=" +
      encodeURI(productDescription) +
      "&profit_shares=" +
      encodeURI(JSON.stringify(profitSplits)) +
      "&vendor_item=" +
      encodeURI(productVendorItem) +
      "&texture=" +
      encodeURI(productTexture) +
      "&user=" +
      encodeURI(storeOwner);

    console.log(
      "POST URL: https://api.zontreck.dev/ls_bionics/Save_Product.php\n\nData: " +
        params
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", processHTTP);
    xhr.send(params);
  };

  const generate_id = () => {
    return uuidv4();
  };

  const renderInventoryList = (entry, index) => {
    return <option>{entry}</option>;
  };

  const handleInventoryChange = (e) => {
    setVendorItem(e.target.value);
  };

  const renderProductList = (entry, index) => {
    return (
      <div>
        <Card body>
          <Form.Row>
            <Col sm="3">
              <Image
                src={"https://secondlife.com/app/image/" + entry.texture + "/1"}
                rounded
              />
            </Col>{" "}
            <Col sm="6">
              <Card className="bg-secondary text-white">
                <Card.Header>{entry.productName}</Card.Header>
                <Card.Body>
                  Price: L$ {entry.price}
                  <br /> Description: {entry.description}
                  <br />
                  Item: <span style={{ color: "#66ccff" }}>{entry.item}</span>
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="danger"
                    onClick={() => deleteProduct(entry.id)}
                  >
                    Delete Product
                  </Button>{" "}
                  <Button
                    variant="success"
                    onClick={() => editProduct(entry.id)}
                  >
                    Edit Product
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Form.Row>
        </Card>
        <br />
        <br />
      </div>
    );
  };

  const deleteProduct = (id) => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/Delete_Product.php?id=" + id,
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();
  };

  const editProduct = (id) => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/Get_Product.php?id=" + id,
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();
  };

  const refreshProductList = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/ls_bionics/List_Products.php?store=" +
        storeName,
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();

    setDLListComplete(true);
  };

  if (!DLListComplete) refreshProductList();

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
          style={{ width: "80vw", textAlign: "left" }}
        >
          <Card.Header>
            {storeName} - Products Manager
            <Button
              variant="success"
              onClick={newProduct}
              style={{ position: "absolute", right: 10 }}
            >
              +
            </Button>{" "}
            <Button
              variant="danger"
              onClick={refreshProductList}
              style={{ position: "absolute", right: 50 }}
            >
              ↺
            </Button>
          </Card.Header>
          <Card.Body>{productList.map(renderProductList)}</Card.Body>
          <Card.Footer>Store Owner: {storeOwner}</Card.Footer>
        </Card>
      </center>
      <Modal size="lg" show={productEditor} onHide={toggleProductEditor}>
        <Modal.Header closeButton>Product Editor - {productName}</Modal.Header>
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
              <Form.Label sm="2">Product ID: {productID}</Form.Label>
            </Form.Row>
            <Form.Row>
              <Form.Label sm="2">Vendor gives item: </Form.Label>
              <Col sm="8">
                <Form.Control
                  as="select"
                  defaultValue="Choose .."
                  onChange={handleInventoryChange}
                  value={productVendorItem}
                >
                  <option>Choose ..</option>
                  {productInventory.map(renderInventoryList)}
                </Form.Control>
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
                  "https://secondlife.com/app/image/" +
                  (productTexture == ""
                    ? "c1cc4102-1622-8f8d-da35-ad599801bbe5"
                    : productTexture) +
                  "/2"
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
            <br />
            <Form.Row>
              <Form.Label sm="2">Profit Splits</Form.Label>
              <Col sm="8">
                <Button variant="success" onClick={newProfitSplit}>
                  +
                </Button>
                <Table striped bordered hover variant="secondary">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Percentage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{profitSplits.map(renderSplits)}</tbody>
                </Table>
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleProductEditor}>
            Cancel
          </Button>
          <Button variant="success" onClick={saveProduct}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoreProductsView;
