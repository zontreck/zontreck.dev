import React, { useState } from "react";
import { Memory } from "../MemorySingleton.js";
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
import { SketchPicker } from "react-color";
import Highlight from "react-highlight";

const ParticleEditor = (props) => {
  const URIStr = atob(props.match.params.url);
  const renderPatternName = () => {
    var ret = "";
    if (patternName == "Explode") {
      ret = "PSYS_SRC_PATTERN_EXPLODE";
    } else if (patternName == "Angle Cone") {
      ret = "PSYS_SRC_PATTERN_ANGLE_CONE";
    } else if (patternName == "Angle") {
      ret = "PSYS_SRC_PATTERN_ANGLE";
    } else if (patternName == "Drop") {
      ret = "PSYS_SRC_PATTERN_DROP";
    }

    return ret;
  };
  const scriptContents = () => {
    var itx = [];
    var flags = [];
    var interopColor = false;
    var drop = false;
    if (patternName == "Drop") drop = true;
    itx.push("PSYS_SRC_PATTERN");
    itx.push(renderPatternName());
    if (radius != 0 && !drop) {
      itx.push("\nPSYS_SRC_BURST_RADIUS");
      itx.push(radius);
    }

    if (isAngle) {
      if (angleBegin != 0) {
        itx.push("\nPSYS_SRC_ANGLE_BEGIN");
        itx.push(angleBegin);
      }
      if (angleEnd != 1) {
        itx.push("\nPSYS_SRC_ANGLE_END");
        itx.push(angleEnd);
      }
    }

    if (startColorHex != "#ffffff") {
      itx.push("\nPSYS_PART_START_COLOR");
      itx.push(
        "<" +
          startColorRgb.r +
          ", " +
          startColorRgb.g +
          ", " +
          startColorRgb.b +
          ">"
      );
    }

    if (endColorHex != "#ffffff") {
      itx.push("\nPSYS_PART_END_COLOR");
      itx.push(
        "<" + endColorRgb.r + "," + endColorRgb.g + "," + endColorRgb.b + ">"
      );
      interopColor = true;
    }

    if (interopColor) flags.push("PSYS_PART_INTERP_COLOR_MASK");
    if (ribbon) flags.push("PSYS_PART_RIBBON_MASK");
    if (windMask && !drop) flags.push("PSYS_PART_WIND_MASK");
    if (bounceMask) flags.push("PSYS_PART_BOUNCE_MASK");
    if (emissiveMask) flags.push("PSYS_PART_EMISSIVE_MASK");
    if (linearMask) flags.push("PSYS_PART_TARGET_LINEAR_MASK");

    if (startAlpha != 0.0) {
      itx.push("\nPSYS_PART_START_ALPHA");
      itx.push(startAlpha);
    }

    if (endAlpha != 1) {
      itx.push("\nPSYS_PART_END_ALPHA");
      itx.push(endAlpha);
    }

    if (startScale.x != 1 || startScale.y != 1) {
      itx.push("\nPSYS_PART_START_SCALE");
      itx.push("<" + startScale.x + ", " + startScale.y + ", 0>");
    }

    if (endScale.x != 1 || endScale.y != 1) {
      itx.push("\nPSYS_PART_END_SCALE");
      itx.push("<" + endScale.x + "," + endScale.y + ",0>");
      flags.push("PSYS_PART_INTERP_SCALE_MASK");
    }

    if (startGlow != 0) {
      itx.push("\nPSYS_PART_START_GLOW");
      itx.push(startGlow);
    }

    if (endGlow != 0) {
      itx.push("\nPSYS_PART_END_GLOW");
      itx.push(endGlow);
    }

    if (sourceMaxAge != 0) {
      itx.push("\nPSYS_SRC_MAX_AGE");
      itx.push(sourceMaxAge);
    }

    if (partMaxAge != 1) {
      itx.push("\nPSYS_PART_MAX_AGE");
      itx.push(partMaxAge);
    }

    if (burstRate != 0) {
      itx.push("\nPSYS_SRC_BURST_RATE");
      itx.push(burstRate);
    }

    if (burstCount != 0) {
      itx.push("\nPSYS_SRC_BURST_PART_COUNT");
      itx.push(burstCount);
    }

    if ((partAccel.x != 0 || partAccel.y != 0 || partAccel.z != 0) && !drop) {
      itx.push("\nPSYS_SRC_ACCEL");
      itx.push(
        "<" + partAccel.x + ", " + partAccel.y + ", " + partAccel.z + ">"
      );
    }

    if ((partOmega.x != 0 || partOmega.y != 0 || partOmega.z != 0) && !drop) {
      itx.push("\nPSYS_SRC_OMEGA");
      itx.push(
        "<" + partOmega.x + ", " + partOmega.y + ", " + partOmega.z + ">"
      );
    }

    if (burstSpeedMin != 0 && !drop) {
      itx.push("\nPSYS_SRC_BURST_SPEED_MIN");
      itx.push(burstSpeedMin);
    }

    if (burstSpeedMax != 0 && !drop) {
      itx.push("\nPSYS_SRC_BURST_SPEED_MAX");
      itx.push(burstSpeedMax);
    }

    if (flags.length != 0) {
      itx.push("\nPSYS_PART_FLAGS");
      itx.push(flags.join("|\n"));
    }
    return (
      "default\n{\n\tstate_entry(){\n\t\t" +
      "llParticleSystem([\n" +
      itx.join(",") +
      "\n\t\t]);\n" +
      "\t}\n}"
    );
  };

  const [patternName, setPatternName] = useState("Explode");
  const [radius, setRadius] = useState(0.0);
  const [isAngle, setIsAngle] = useState(false);
  const [angleBegin, setAngleBegin] = useState(0.0);
  const [angleEnd, setAngleEnd] = useState(1.0);
  const [dirty, setDirty] = useState(true);
  const [startColorHex, setStartColorHex] = useState("#ffffff");
  const [startColorRgb, setStartColorRgb] = useState({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
  const [startColorPicker, setStartColorPicker] = useState(false);
  const toggleStartColorPicker = () => setStartColorPicker(!startColorPicker);
  const [endColorHex, setEndColorHex] = useState("#ffffff");
  const [endColorRgb, setEndColorRgb] = useState({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
  const [endColorPicker, setEndColorPicker] = useState(false);
  const toggleEndColorPicker = () => setEndColorPicker(!endColorPicker);
  const [startAlpha, setStartAlpha] = useState(0.0);
  const [endAlpha, setEndAlpha] = useState(1.0);
  const [ribbon, setRibbon] = useState(false);
  const [windMask, setWindMask] = useState(false);
  const [bounceMask, setBounceMask] = useState(false);
  const [emissiveMask, setEmissiveMask] = useState(false);
  const [linearMask, setLinearMask] = useState(false);
  const [startScale, setStartScale] = useState({
    x: 1,
    y: 1,
    z: 0,
  });
  const [endScale, setEndScale] = useState({
    x: 1,
    y: 1,
    z: 0,
  });
  const [startGlow, setStartGlow] = useState(0.0);
  const [endGlow, setEndGlow] = useState(0.0);
  const [sourceMaxAge, setSourceMaxAge] = useState(0);
  const [partMaxAge, setPartMaxAge] = useState(1);
  const [burstRate, setBurstRate] = useState(0);
  const [burstCount, setBurstCount] = useState(0);
  const [partAccel, setPartAccel] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [partOmega, setPartOmega] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [burstSpeedMin, setBurstSpeedMin] = useState(0);
  const [burstSpeedMax, setBurstSpeedMax] = useState(0);

  const processPostChange = () => {
    if (!dirty) return;
    switch (patternName) {
      case "Angle":
        setIsAngle(true);
        break;
      case "Angle Cone":
        setIsAngle(true);
        break;
      default:
        setIsAngle(false);
        break;
    }

    // BEGIN SEND TO SECOND LIFE FUNCTIONS

    // END SEND TO SECOND LIFE
    setDirty(false);
    return <div></div>;
  };

  return (
    <div>
      {dirty && processPostChange()}
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/account">Account</Breadcrumb.Item>
        <Breadcrumb.Item disabled>Products</Breadcrumb.Item>
        <Breadcrumb.Item href="/account/products/particle">
          Particle Editor
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{URIStr}</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          width: "80vw",
          height: "75vh",
          position: "absolute",
          left: "5vw",
        }}
      >
        <Card className="bg-dark text-white">
          <Card.Title>
            <center>Particle Editor</center>
          </Card.Title>
          <Card.Body>
            <div
              style={{
                width: "45%",
                height: "100%",
                position: "absolute",
                right: 25,
                top: 25,
              }}
            >
              <Card className="bg-secondary text-white">
                <Card.Title>
                  <center>Script Output</center>
                </Card.Title>
                <Card.Body>
                  <Highlight language="lsl">{scriptContents()}</Highlight>
                </Card.Body>
              </Card>
            </div>
            <Form>
              <Form.Row>
                <Form.Label>Pattern: </Form.Label>
                <Col sm="4">
                  <Form.Control
                    as="select"
                    value={patternName}
                    onChange={(e) => {
                      setPatternName(e.target.value);
                      setDirty(true);
                    }}
                  >
                    <option>Explode</option>
                    <option>Angle Cone</option>
                    <option>Angle</option>
                    <option>Drop</option>
                  </Form.Control>
                </Col>
              </Form.Row>
              {patternName != "Drop" && (
                <Form.Row>
                  <Form.Label sm="2">Radius: </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      type="range"
                      value={radius}
                      onChange={(e) => {
                        setRadius(e.target.value);
                        setDirty(true);
                      }}
                      min="0"
                      max="50"
                      step="0.01"
                    ></Form.Control>
                  </Col>
                </Form.Row>
              )}
              {isAngle && (
                <Form.Row>
                  <Form.Label sm="2">Angle Begin: </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      type="range"
                      value={angleBegin}
                      onChange={(e) => {
                        setAngleBegin(e.target.value);
                        setDirty(true);
                      }}
                      min="0"
                      max={angleEnd}
                      step="0.01"
                    ></Form.Control>
                  </Col>
                </Form.Row>
              )}

              {isAngle && (
                <Form.Row>
                  <Form.Label sm="2">Angle End: </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      type="range"
                      value={angleEnd}
                      onChange={(e) => {
                        setAngleEnd(e.target.value);
                        setDirty(true);
                      }}
                      min={angleBegin}
                      max="1"
                      step="0.01"
                    ></Form.Control>
                  </Col>
                </Form.Row>
              )}

              <Form.Row>
                <Form.Label sm="2">Starting Color: </Form.Label>
                <Col sm="4">
                  <div
                    style={{
                      width: 25,
                      height: 25,
                      backgroundColor: startColorHex,
                    }}
                    onClick={toggleStartColorPicker}
                  >
                    {" "}
                  </div>
                  {startColorPicker && (
                    <SketchPicker
                      color={startColorHex}
                      onChangeComplete={(c) => {
                        setStartColorHex(c.hex);
                        setStartColorRgb(c.rgb);
                        setDirty(true);
                      }}
                    ></SketchPicker>
                  )}
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Ending Color: </Form.Label>
                <Col sm="4">
                  <div
                    style={{
                      width: 25,
                      height: 25,
                      backgroundColor: endColorHex,
                    }}
                    onClick={toggleEndColorPicker}
                  >
                    {" "}
                  </div>
                  {endColorPicker && (
                    <SketchPicker
                      color={endColorHex}
                      onChangeComplete={(c) => {
                        setEndColorHex(c.hex);
                        setEndColorRgb(c.rgb);
                        setDirty(true);
                      }}
                    ></SketchPicker>
                  )}
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Starting Alpha: </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="range"
                    value={startAlpha}
                    onChange={(e) => {
                      setStartAlpha(e.target.value);
                      setDirty(true);
                    }}
                    min="0"
                    max="1"
                    step="0.01"
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Ending Alpha: </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="range"
                    value={endAlpha}
                    onChange={(e) => {
                      setEndAlpha(e.target.value);
                      setDirty(true);
                    }}
                    min="0"
                    max="1"
                    step="0.01"
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Target Pos</Form.Label>
              </Form.Row>
              <Form.Row>
                <Form.Label sm="2">Target ID</Form.Label>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Ribbon Particles? </Form.Label>
                <Col sm="1">
                  <Form.Control
                    type="checkbox"
                    value={ribbon}
                    onClick={() => {
                      setRibbon(!ribbon);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>
              {patternName != "Drop" && (
                <Form.Row>
                  <Form.Label sm="2">Affected By Wind? </Form.Label>
                  <Col sm="1">
                    <Form.Control
                      type="checkbox"
                      value={windMask}
                      onClick={() => {
                        setWindMask(!windMask);
                        setDirty(true);
                      }}
                    ></Form.Control>
                  </Col>
                </Form.Row>
              )}
              <Form.Row>
                <Form.Label sm="2">Bounce? </Form.Label>
                <Col sm="1">
                  <Form.Control
                    type="checkbox"
                    value={bounceMask}
                    onClick={() => {
                      setBounceMask(!bounceMask);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Linear? </Form.Label>
                <Col sm="1">
                  <Form.Control
                    type="checkbox"
                    value={linearMask}
                    onClick={() => {
                      setLinearMask(!linearMask);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Emissive? </Form.Label>
                <Col sm="1">
                  <Form.Control
                    type="checkbox"
                    value={emissiveMask}
                    onClick={() => {
                      setEmissiveMask(!emissiveMask);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Start Scale: </Form.Label>
                <Col sm="4">
                  <Col sm="4">
                    <Form.Row>
                      <Form.Label>X </Form.Label>
                      <Form.Control
                        type="range"
                        min="0.03125"
                        max="4.0"
                        step="0.00001"
                        value={startScale.x}
                        onChange={(e) => {
                          var v3 = startScale;
                          v3.x = e.target.value;
                          setStartScale(v3);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Form.Row>
                  </Col>
                  <Col sm="4">
                    <Form.Row>
                      <Form.Label>Y </Form.Label>
                      <Form.Control
                        type="range"
                        min="0.03125"
                        max="4.0"
                        step="0.00001"
                        value={startScale.y}
                        onChange={(e) => {
                          var v3 = startScale;
                          v3.y = e.target.value;
                          setStartScale(v3);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Form.Row>
                  </Col>
                </Col>
                <Form.Control
                  type="text"
                  value={"" + startScale.x + "," + startScale.y}
                  onChange={(e) => {
                    var tmp = e.target.value.split(",");
                    var objs = {
                      x: tmp[0],
                      y: tmp[1],
                      z: 0,
                    };

                    setStartScale(objs);
                  }}
                ></Form.Control>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">End Scale: </Form.Label>
                <Col sm="10">
                  <Col sm="4">
                    <Form.Row>
                      {<Form.Label>X </Form.Label>}
                      <Form.Control
                        type="range"
                        min="0.03125"
                        max="4.0"
                        step="0.00001"
                        value={endScale.x}
                        onChange={(e) => {
                          var v3 = endScale;
                          v3.x = e.target.value;
                          setEndScale(v3);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Form.Row>
                  </Col>
                  <Col sm="4">
                    <Form.Row>
                      <Form.Label>Y </Form.Label>
                      <Form.Control
                        type="range"
                        min="0.03125"
                        max="4.0"
                        step="0.00001"
                        value={endScale.y}
                        onChange={(e) => {
                          var v3 = endScale;
                          v3.y = e.target.value;
                          setEndScale(v3);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Form.Row>
                  </Col>
                </Col>
                <Form.Control
                  type="text"
                  value={"" + endScale.x + "," + endScale.y}
                  onChange={(e) => {
                    var tmp = e.target.value.split(",");
                    var objs = {
                      x: tmp[0],
                      y: tmp[1],
                      z: 0,
                    };

                    setEndScale(objs);
                  }}
                ></Form.Control>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Start Glow: </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="range"
                    min="0"
                    max="1"
                    value={startGlow}
                    onChange={(e) => {
                      setStartGlow(e.target.value);
                      setDirty(true);
                    }}
                    step="0.01"
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">End Glow: </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="range"
                    min="0"
                    max="1"
                    value={endGlow}
                    onChange={(e) => {
                      setEndGlow(e.target.value);
                      setDirty(true);
                    }}
                    step="0.01"
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Source Max Age: </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="range"
                    min="0"
                    max="1000"
                    step="0.1"
                    value={sourceMaxAge}
                    onChange={(e) => {
                      setSourceMaxAge(e.target.value);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Particle Max Age: </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="range"
                    min="1"
                    max="30"
                    step="0.1"
                    value={partMaxAge}
                    onChange={(e) => {
                      setPartMaxAge(e.target.value);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Particle Burst Rate: </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="range"
                    min="0"
                    max="500"
                    step="0.1"
                    value={burstRate}
                    onChange={(e) => {
                      setBurstRate(e.target.value);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>

              <Form.Row>
                <Form.Label sm="2">Particle Burst Count: </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="range"
                    min="0"
                    max="300"
                    step="1"
                    value={burstCount}
                    onChange={(e) => {
                      setBurstCount(e.target.value);
                      setDirty(true);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Row>
              {patternName != "Drop" && (
                <Form.Row>
                  <Form.Label sm="2">Particle Acceleration: </Form.Label>
                  <Col sm="6">
                    <Col sm="4">
                      <Form.Label>X: </Form.Label>
                      <Form.Control
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={partAccel.x}
                        onChange={(e) => {
                          var v = partAccel;
                          v.x = e.target.value;
                          setPartAccel(v);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Col>
                    <Col sm="4">
                      <Form.Label>Y: </Form.Label>
                      <Form.Control
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={partAccel.y}
                        onChange={(e) => {
                          var v = partAccel;
                          v.y = e.target.value;
                          setPartAccel(v);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Col>
                    <Col sm="4">
                      <Form.Label>Z: </Form.Label>
                      <Form.Control
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={partAccel.z}
                        onChange={(e) => {
                          var v = partAccel;
                          v.z = e.target.value;
                          setPartAccel(v);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Col>
                  </Col>
                </Form.Row>
              )}
              {patternName != "Drop" && (
                <Form.Row>
                  <Form.Label sm="2">Particle Omega: </Form.Label>
                  <Col sm="6">
                    <Col sm="4">
                      <Form.Label>X: </Form.Label>
                      <Form.Control
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={partOmega.x}
                        onChange={(e) => {
                          var v = partOmega;
                          v.x = e.target.value;
                          setPartOmega(v);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Col>
                    <Col sm="4">
                      <Form.Label>Y: </Form.Label>
                      <Form.Control
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={partOmega.y}
                        onChange={(e) => {
                          var v = partOmega;
                          v.y = e.target.value;
                          setPartOmega(v);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Col>
                    <Col sm="4">
                      <Form.Label>Z: </Form.Label>
                      <Form.Control
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={partOmega.z}
                        onChange={(e) => {
                          var v = partOmega;
                          v.z = e.target.value;
                          setPartOmega(v);
                          setDirty(true);
                        }}
                      ></Form.Control>
                    </Col>
                  </Col>
                </Form.Row>
              )}
              {patternName != "Drop" && (
                <div>
                  <Form.Row>
                    <Form.Label sm="2">Burst Speed Min</Form.Label>
                    <Col sm="4">
                      <Form.Control
                        type="range"
                        min="0"
                        max={burstSpeedMax}
                        value={burstSpeedMin}
                        onChange={(e) => {
                          setBurstSpeedMin(e.target.value);
                          setDirty(true);
                        }}
                        step="0.01"
                      ></Form.Control>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Form.Label sm="2">Burst Speed Max</Form.Label>
                    <Col sm="4">
                      <Form.Control
                        type="range"
                        min={burstSpeedMin}
                        max="255"
                        value={burstSpeedMax}
                        onChange={(e) => {
                          setBurstSpeedMax(e.target.value);
                          setDirty(true);
                        }}
                        step="0.01"
                      ></Form.Control>
                    </Col>
                  </Form.Row>
                </div>
              )}
            </Form>
          </Card.Body>
          <Card.Footer>
            This section contains the synchronization status indicators to and
            from SL, and any live sync status messages
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};
export default ParticleEditor;
