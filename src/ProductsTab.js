import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Form, Button, Table } from "react-bootstrap";
import { Memory } from "./MemorySingleton.js";

const ProductsTab = (props) => {
  const mem = new Memory();
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
          <tr>
            <td>Particle Editor</td>
            <td>
              Interactive particle editor, inspired by Schmobag Hogfather's
              Schmarticles
            </td>
            <td>
              <Button href="/account/products/particle" variant="primary">
                View
              </Button>
            </td>
          </tr>
          {mem.Level >= 3 && (
            <tr>
              <td>Cards Against Humanity</td>
              <td>Card Creation Tool for Admins</td>
              <td>
                <Button href="/account/products/cah_manager" variant="primary">
                  View
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsTab;
