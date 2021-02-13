import React, { useState } from "react";
import {
  Button,
  Breadcrumb,
  Card,
  Image,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const VendorView = (props) => {
  const { addToast } = useToasts();
  const [storeName, setStoreName] = useState(props.match.params.storeName);
  const [storeOwner, setStoreOwner] = useState("-not_loaded-");
  const [DLStoreComplete, setDLStoreComplete] = useState(false);
  const [DLVendors, setDLVendors] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [DLProducts, setDLProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [editor, setEditor] = useState(false);
  const toggleEditor = () => setEditor(!editor);
  const [vendorOnline, setVendorOnline] = useState(false);
  const [vendorProductNames, setVendorProductNames] = useState([]);
  const [vendorProductIDs, setVendorProductIDs] = useState([]);
  const [vendorProductName, setVendorProductName] = useState("");
  const [vendorIndex, setVendorIndex] = useState(0);

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
      } else if (datas[0] == "List_Vendors") {
        var seg = datas[1].split("~");
        var vendTmp = [];
        for (var i = 0; i < seg.length; i++) {
          var theVendor = seg[i].split("|");
          var theVend = [];
          theVend.id = theVendor[0];
          theVend.region = theVendor[1];
          theVend.enabled = theVendor[2];
          theVend.affiliate = theVendor[3];
          theVend.url = theVendor[4];
          theVend.product = theVendor[5];
          theVend.owner = theVendor[6];
          theVend.store = theVendor[7];

          vendTmp.push(theVend);
        }

        setVendors(vendTmp);
      } else if (datas[0] == "List_Products") {
        var segments = datas[1].split(";");

        var prodLst = [];
        var nmLst = [];
        var idLst = [];
        for (var i = 0; i < segments.length; i++) {
          var product = segments[i].split("~");
          var actualProduct = [];

          actualProduct.store = product[0];
          actualProduct.id = product[1];
          actualProduct.name = product[2];
          actualProduct.price = product[3];
          actualProduct.description = product[4];
          actualProduct.splits = product[5];
          actualProduct.texture = product[6];
          actualProduct.item = product[7];

          nmLst.push(actualProduct.name);
          idLst.push(actualProduct.id);

          prodLst[actualProduct.id] = actualProduct;
        }

        setProducts(prodLst);
        setVendorProductIDs(idLst);
        setVendorProductNames(nmLst);
      } else if (datas[0] == "Update_Vendor") {
        if (datas[1] == "0") {
          addToast("Vendor updated. Pinging with a refresh signal", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 5000,
          });

          xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            "https://api.zontreck.dev/zni/RelayHTTP.php",
            false
          );
          var para =
            "url=" +
            encodeURI(vendors[vendorIndex].url) +
            "&data=" +
            btoa("refresh") +
            "&method=POST";

          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xhr.addEventListener("load", processHTTP);
          xhr.send(para);

          toggleEditor();
          refreshVendorList();
        } else if (datas[1] == "1") {
          addToast("Unknown error occured during update. Changes not applied", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 5000,
          });
        }
      } else if (datas[0] == "LSVendor") {
        // request has completed!
      } else if (datas[0] == "LoginSessionData") {
        if (datas[1] == "user") {
          if (datas[2] == "n/a/n") {
            window.location = "/login";
          } else {
            xhr = new XMLHttpRequest();
            xhr.open(
              "POST",
              "https://api.zontreck.dev/zni/RelayHTTP.php",
              false
            );
            var params =
              "url=" +
              encodeURI(vendors[vendorIndex].url) +
              "&data=" +
              btoa("test_vend;;" + datas[2]) +
              "&method=POST";
            xhr.setRequestHeader(
              "Content-Type",
              "application/x-www-form-urlencoded"
            );
            xhr.send(params);
          }
        }
      }
    }
  };

  if (!DLStoreComplete) {
    setDLStoreComplete(true);

    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/Get_Store.php?name=" + storeName,
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();
  }

  const refreshVendorList = () => {
    setDLProducts(false);
    doDLProducts();
    setDLVendors(false);
    doDLVendors();
  };

  const doDLProducts = () => {
    if (DLProducts) return;

    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/List_Products.php?store=" +
        encodeURI(storeName),
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();

    setDLProducts(true);
  };

  const doDLVendors = () => {
    if (DLVendors) return;
    // ask server for vendor listing
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/List_Vendors_ByStore.php?store=" +
        encodeURI(storeName),
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();

    setDLVendors(true);
  };

  if (!DLProducts) doDLProducts();
  if (!DLVendors) doDLVendors();

  const renderVendorsList = (entry, index) => {
    return (
      <div key={index}>
        <Card
          className="bg-secondary text-white"
          style={{ width: "90%", textAlign: "left" }}
        >
          <Card.Header>
            Vendor @ {entry.region} - {products[entry.product].name}
          </Card.Header>
          <Card.Body>
            <Form.Row>
              <Col sm="3">
                <Image
                  src={
                    "https://secondlife.com/app/image/" +
                    products[entry.product].texture +
                    "/1"
                  }
                  rounded
                />
              </Col>
              <Col sm="8">
                {" "}
                <Card className="bg-dark text-white" style={{ width: "90%" }}>
                  <Card.Header>Vendor ID: {entry.id}</Card.Header>
                  <Card.Body>
                    Product: {products[entry.product].name}
                    <br />
                    Price: L$ {products[entry.product].price}
                    <br />
                    Description: {products[entry.product].description}
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="success" onClick={() => EditVendor(index)}>
                      Edit Vendor
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            </Form.Row>
          </Card.Body>
        </Card>
        <br />
      </div>
    );
  };

  const EditVendor = (zVendorIndex) => {
    // Pulls up the vendor editor
    setVendorOnline(vendors[zVendorIndex].enabled);
    setVendorIndex(zVendorIndex);
    var productID = vendors[zVendorIndex].product;
    setVendorProductName(products[productID].name);

    setTimeout(() => {
      toggleEditor();
    }, 500);
  };

  const renderProductChoices = (entry, index) => {
    //console.log("ENTRY: "+entry);
    return <option key={index}>{entry}</option>;
  };

  const handleNewVendorProduct = (e) => {
    setVendorProductName(e.target.value);
  };

  const doSaveVendorData = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/zni/Update_Vendor_WithConfig.php",
      false
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var params =
      "ID=" +
      vendors[vendorIndex].id +
      "&region=" +
      encodeURI(vendors[vendorIndex].region) +
      "&affiliate=" +
      vendors[vendorIndex].affiliate +
      "&url=" +
      encodeURI(vendors[vendorIndex].url) +
      "&product=" +
      encodeURI(
        vendorProductIDs[vendorProductNames.indexOf(vendorProductName)]
      ) +
      "&obj_owner=" +
      vendors[vendorIndex].owner +
      "&store=" +
      encodeURI(storeName);

    xhr.addEventListener("load", processHTTP);
    xhr.send(params);
  };

  const testVendor = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/SessionsData.php?action=get&var=user",
      false
    );
    xhr.addEventListener("load", processHTTP);
    xhr.send();
  };

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
          <Breadcrumb.Item active>Vendors Manager</Breadcrumb.Item>
        </Breadcrumb>
        <br />
        <Card
          className="bg-dark text-white"
          style={{ width: "80vw", textAlign: "left" }}
        >
          <Card.Header>
            {storeName} - Vendors Manager
            <div>
              <Button
                variant="danger"
                onClick={() => refreshVendorList()}
                style={{ position: "absolute", right: 0, top: 0 }}
              >
                ↺
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {vendors.map(renderVendorsList)}
            <br />
            <Card className="bg-dark text-white">
              <Card.Header>Unassociated Vendors</Card.Header>
              <Card.Body>
                The list of vendors not yet assigned to a store
              </Card.Body>
            </Card>
          </Card.Body>
          <Card.Footer>Store Owner: {storeOwner}</Card.Footer>
        </Card>
      </center>
      <Modal show={editor} onHide={toggleEditor} size="lg">
        <Modal.Header closeButton>Vendor Editor</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Check
                type="checkbox"
                label="Vendor Online"
                checked={vendorOnline}
                onClick={() => setVendorOnline(!vendorOnline)}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label sm="2">Vendor Product: </Form.Label>
              <Col sm="8">
                <Form.Control
                  as="select"
                  defaultValue="Choose.."
                  onChange={handleNewVendorProduct}
                  value={vendorProductName}
                >
                  <option>Choose..</option>
                  {vendorProductNames.map(renderProductChoices)}
                </Form.Control>
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleEditor}>
            Cancel
          </Button>{" "}
          <Button variant="success" onClick={doSaveVendorData}>
            Update Vendor
          </Button>{" "}
          <Button variant="primary" onClick={testVendor}>
            Test Delivery
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorView;
