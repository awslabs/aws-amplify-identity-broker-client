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
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

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
