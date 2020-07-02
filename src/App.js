import React from "react";
import { Alert } from "react-bootstrap";
import ZDevNavBar from "./ZontreckDevNavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./ZHomePage";
import "./App.css";
import About from "./AboutPage";

function App() {
  const show = true;
  const HomePage = () => <Home />;
  const AboutPage = () => <About />;
  document.body.style = "background: black;color:green";
  return (
    <div
      id="mainApp"
      style={{
        backgroundColor: "black",
        color: "green",
      }}
    >
      <center>
        <ZDevNavBar />
        <div class="generalAlertContainer">
          <Alert variant="danger" show={show}>
            This website is under construction, content may shift around
            unexpectedly!
          </Alert>
        </div>
      </center>
      <Router>
        <>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/about" exact component={AboutPage}></Route>
        </>
      </Router>
    </div>
  );
}

export default App;
