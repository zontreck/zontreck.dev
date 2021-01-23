import React, { useState } from "react";
import { Breadcrumb, Card, Tabs, Tab, Modal, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import AlertStore from "./AlertStore.js";
import SingleTimers from "./SingleTimers.js";

const ZDevNotifierCheck = (props) => {
  const { addToast } = useToasts();
  const unixTime = () => {
    return Math.floor(Date.now() / 1000);
  };
  const alerts = [];
  const timerCode = () => {
    // Query the server for any alerts
    // Store the last checked time. If the server's alert has a timestamp greater than our current time, then the alert is valid. The alert must have a timestamp set in the future, which is effectively the timestamp for when the alert will expire.
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.zontreck.dev/zni/CheckNotifications.php?currentTime=" +
        unixTime(),
      false
    );
    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        var data = xhr.responseText.split(";;");
        if (data[0] == "CheckNotifications") {
          var i = 0;
          for (i = 0; i < data.length; i++) {
            var datas = data[i].split("~");
            if (!AlertStore.instance()._alerts.includes(datas[0])) {
              if (unixTime() < Number(datas[1])) {
                AlertStore.instance()._alerts.push(datas[0]);
                console.log("Posting toast with provided parameters!");
                addToast("Alert posted at (" + datas[4] + "): " + datas[0], {
                  appearance: datas[2],
                  autoDismiss: true,
                  autoDismissTimeout: Number(datas[3]),
                });
              } else {
                console.log(
                  "Number check error: " + Number(datas[1]) + "\n" + unixTime()
                );
              }
            } else {
              console.log("Already has alert");
            }
          }
        }
      }
    });
    xhr.send();
  };

  SingleTimers.instance().add(timerCode, 5000, "notification_checks");

  return null;
};

export default ZDevNotifierCheck;
