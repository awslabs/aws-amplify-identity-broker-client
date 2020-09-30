/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import React from "react";
import Homepage from "./HomePage";
import NavBar from "./NavBar";
import { Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Hub, Auth } from 'aws-amplify';
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

// https://aws-amplify.github.io/docs/js/hub
Hub.listen(/.*/, ({ channel, payload }) =>
  console.debug(`[hub::${channel}::${payload.event}]`, payload)
)
var url = window.location.href.split("/");
var domain = url[0] + "//" + url[2]

Auth.configure({
  userPoolId: "us-west-2_XXXXXXXXX", // This won't be used
  userPoolWebClientId: Config.clientId,
  oauth: {
    domain: Config.brokerUrl,
    scope: ['email', 'profile', 'openid'],
    redirectSignIn: domain,
    redirectSignOut: domain,
    responseType: 'code',
  },
})

type AppState = {
  text: string;
}

class App extends React.Component<{}, AppState> {
  render() {
    return (
      <div>
        <Helmet>
          <title>{Config.websiteName} - Sample {Config.flow} Client</title>
        </Helmet>
        <NavBar />
        <Route exact path='/' component={Homepage} />
      </div>
    );
  }
}

export default App;
