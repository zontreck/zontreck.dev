import React from "react";

const LogoutPage = (props) => {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.zontreck.dev/zni/LogoutAccount.php",
    false
  );
  xhr.send();

  setTimeout(() => {
    window.location = "/";
  }, 5000);

  return (
    <div>
      <center>
        <h2>Logging out...</h2>
      </center>
    </div>
  );
};

export default LogoutPage;
