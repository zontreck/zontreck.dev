import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Form, Col, Table, Button } from "react-bootstrap";
import SingleTimers from "./SingleTimers.js";

const Search = (props) => {
  const [searchText, setSearchText] = useState("");
  const [table, setTable] = useState([]);
  const processHTTP = () => {
    if (xhr.readyState === 4) {
      var data = xhr.responseText.split(";;");
      if (data[0] == "AdminsSearch") {
        var arr = [];
        var data2 = data[1].split("~");
        for (var i = 0; i < data2.length; i++) {
          var data3 = data2[i].split(";");
          arr.push({ username: data3[0], level: Number(data3[1]) });
        }

        setTable(arr);
      }
    }
  };

  var xhr = null;
  const updateSearchText = () => {
    xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.zontreck.dev/ls_bionics/AdminsSearch.php",
      false
    );
    var params = "q=" + encodeURI(searchText);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.addEventListener("load", processHTTP);
    xhr.send(params);
  };

  const renderUserSearch = (entry, index) => {
    return (
      <tr key={index}>
        <td>{entry.username}</td>
        <td>{entry.level}</td>
        <td>Not implemented</td>
      </tr>
    );
  };

  //SingleTimers.instance().add(updateSearchText, 10000, "update_search_text");
  //setInterval(updateSearchText, 10000);
  const handleNewSearch = (event) =>{
      setTable([]);
      setSearchText(event.target.value);
  }


  return (
    <div>
      <Form>
        <Form.Row>
          <Form.Label sm="2">Search Query: </Form.Label>
          <Col sm="10">
            {" "}
            <Form.Control
              type="text"
              value={searchText}
              onChange={handleNewSearch}
            ></Form.Control>
            <Button onClick={()=>setTimeout(updateSearchText, 5000)} variant="primary">Search</Button>
          </Col>
        </Form.Row>
      </Form>
      <br />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Username</th>
            <th>Account Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{table.map(renderUserSearch)}</tbody>
      </Table>
    </div>
  );
};

export default Search;
