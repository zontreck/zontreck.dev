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
        <div
          class="generalAlertContainer"
          style={{
            position: "fixed",
            left: "50%",
            top: "100",
          }}
        >
          <Alert variant="danger" show={show}>
            This website is under construction, content may shift around
            unexpectedly!
          </Alert>
        </div>
      </center>
      <div
        style={{
          position: "fixed",
          top: 100,
          left: 0,
          height: "100%",
        }}
      >
        <Router>
          <>
            <Route path="/" exact component={HomePage}></Route>
            <Route path="/about" exact component={AboutPage}></Route>
          </>
        </Router>
      </div>
    </div>
  );
}

export default App;
