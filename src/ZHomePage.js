import React from "react";
import gh from "./gh_zon.png";
import Table from "react-bootstrap/Table";

function Home() {
  return (
    <div style={{ marginLeft: "20px" }}>
      <h1>Welcome to zontreck/dev</h1>
      This site is home to various different services.
      <center>
        <div class="row">
          <div class="col-sm-6">
            <Table
              striped
              bordered
              hover
              variant="dark"
              className="tableObj"
              size="sm"
            >
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Zontreck.dev</td>
                  <td>This site! The main landing area</td>
                </tr>
                <tr>
                  <td>zni.zontreck.dev</td>
                  <td>
                    This is a semi private subdomain whose entire purpose is
                    dataserver related operations for apps
                  </td>
                </tr>
                <tr>
                  <td>mc.zontreck.dev</td>
                  <td>Minecraft... </td>
                </tr>
                <tr>
                  <td>api.zontreck.dev</td>
                  <td>
                    Similar to zni.zontreck.dev, except that this domain serves
                    external services with application specific scripts. For
                    instance, it hooks into share.zontreck.dev
                  </td>
                </tr>
                <tr>
                  <td>share.zontreck.dev</td>
                  <td>
                    Screenshot and filesharing host. Files are uploaded to
                    api.zontreck.dev using service.php and are then given a home
                    here with a randomized filename (Thus also sanitzized
                    against hack attempts)
                  </td>
                </tr>
                <tr>
                  <td>ci.zontreck.dev:8080</td>
                  <td>
                    Continuous integration server. This builds all my software,
                    as well as software I use frequently to speed up deployment
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </center>
    </div>
  );
}

export default Home;
