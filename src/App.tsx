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
import AuthState, { BROADCAST_AUTH_CHANNEL, BROADCAST_EVENT }  from "./AuthState";
import { Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Hub, Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

var url = window.location.href.split("/");
var domain = url[0] + "//" + url[2]

Auth.configure({
  userPoolId: "us-west-2_XXXXXXXXX", // This won"t be used
  userPoolWebClientId: Config.clientId,
  oauth: {
    domain: Config.brokerUrl,
    scope: ["email", "profile", "openid"],
    redirectSignIn: domain,
    redirectSignOut: domain,
    responseType: "code",
  },
})



class App extends React.Component<any> {

  constructor(props: any) {
    super(props);
    Hub.listen("auth", this._handleAuthStateChange);
  }


  async componentDidMount() {
    this._handleAuthStateChange({event: "init"});
  }

  async _handleAuthStateChange(payload: any){
    switch (payload.event) {
      case "configured":
      case "signIn":
      case "signIn_failure":
      case "signOut":
      case "init":
        Hub.dispatch(BROADCAST_AUTH_CHANNEL, { event: BROADCAST_EVENT[BROADCAST_EVENT.LOADING], message: "key" } );
        try{
          const user: CognitoUser = await Auth.currentAuthenticatedUser();
          const authState: AuthState = {
            isAuthenticated: this._isAuthenticated(user),
            user: user,
          };
          Hub.dispatch(BROADCAST_AUTH_CHANNEL, { event: BROADCAST_EVENT[BROADCAST_EVENT.UPDATED], data: authState, message: "key" } );
        } catch(err) {
          const authState: AuthState = {
            isAuthenticated: false,
            user: null,
          };
          Hub.dispatch(BROADCAST_AUTH_CHANNEL, { event: BROADCAST_EVENT[BROADCAST_EVENT.UPDATED], data: authState, message: "key" } );
        }
        break;
      default:
        break;
    }
  }

  _isAuthenticated(user: CognitoUser) {
    if (
      !user ||
      !user.getSignInUserSession() ||
      !user.getSignInUserSession()!.isValid() // isValid() also verified the Token Signature
    ) {
      return false
    }
    return true;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{Config.websiteName} - Sample {Config.flow} Client</title>
        </Helmet>
        <NavBar />
        <Route exact path="/" component={Homepage} />
      </div>
    );
  }
}

export default App;
