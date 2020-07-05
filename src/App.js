import React from "react";
import { Alert } from "react-bootstrap";
import ZDevNavBar from "./ZontreckDevNavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./ZHomePage";
import "./App.css";
import About from "./AboutPage";
import MakeAlert from "./Notification";

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
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "fixed",
            minHeight: "200px",
            top: 100,
            right: 50,
            zIndex: 1000,
            width: "50%",
            height: "100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <MakeAlert
              AlertTitle="This website is under construction"
              AlertBody="Content may shift around unexpectedly!"
            />
          </div>
        </div>
      </center>
      <div
        style={{
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
