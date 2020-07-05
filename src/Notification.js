import React, { useState } from "react";
import { Toast, ToastHeader, ToastBody } from "react-bootstrap";

function MakeAlert(props) {
  const [show, setShow] = useState(true);

  return (
    <Toast onClose={() => setShow(false)} show={show} delay={10000} autohide>
      <Toast.Header>
        <strong className="mr-auto">Zontreck.dev</strong>
        <small>just now</small>
      </Toast.Header>
      <Toast.Body>
        {props.AlertTitle}
        <br />
        {props.AlertBody}
      </Toast.Body>
    </Toast>
  );
}

export default MakeAlert;
