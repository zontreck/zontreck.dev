import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Form, Button, Table } from "react-bootstrap";

const ProductsTab = (props) => {
  return (
    <div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Store System</td>
            <td>Store Servers and Vendors</td>
            <td>
              <Button href="/account/products/stores" variant="primary">
                View
              </Button>
            </td>
          </tr>
          <tr>
            <td>OpenSimulator</td>
            <td>Account Management for OpenSim</td>
            <td>
              <Button href="/account/products/opensim" variant="primary">
                View
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsTab;
