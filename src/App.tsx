/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 
Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
or in the "license" file accompanying this file. This file is distributed 
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either 
express or implied. See the License for the specific language governing 
permissions and limitations under the License. */

import React from "react";
import crypto from "crypto";
import { base64URLEncode, sha256 } from "./codeFunctions"
import "./App.css";
import Homepage from "./homepage";
import PrivatePage from "./privatepage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AmplifyButton } from "@aws-amplify/ui-react";
import { AnyMxRecord } from "dns";
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

const containerStyle: React.CSSProperties = { width: 400, margin: "0 auto", display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", padding: 20 };

type AppState = {
  text: string;
}

class App extends React.Component<{}, AppState> {

  constructor(props: any, context: AnyMxRecord) {
    super(props, context);
    this.state = { text: "Login" };
  }

  componentDidMount() {
    this.handleRedirect();
  }

  async handleRedirect() {
    const queryStringParams = new URLSearchParams(window.location.search);
    if (!queryStringParams.has("code")) {
      return;
    }

    const code: string = queryStringParams.get("code")!.toString();
    const code_verifier: string | null = sessionStorage.getItem(`login-code-verifier`);

    if (code_verifier === undefined) {
      console.log("login code verifier not in sesssion storage");
      return;
    }

    const tokenEndpointURL = Config.brokerUrl + "/oauth2/token";
    const tokens = await fetch(tokenEndpointURL, {
      method: "POST",
      body: new URLSearchParams({
        authorization_code: code,
        client_id: Config.clientId,
        code_verifier: code_verifier!,
        redirect_uri: Config.baseUrl
      }),
      headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      })
    }).then(r => r.json());

    console.dir(tokens);
    this.setState({ text: "Log out" });

    const url = new URL(window.location.href);
    url.search = "";
    window.history.pushState("", document.title, url.href);
  }

  login = () => {
    const codeVerifier: string = base64URLEncode(crypto.randomBytes(32));
    const codeChallenge: string = base64URLEncode(sha256(codeVerifier));

    const authorizationEndpointUrl = new URL(Config.brokerUrl + "/oauth2/authorize");
    authorizationEndpointUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: Config.clientId,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      redirect_uri: Config.baseUrl
    }).toString();

    sessionStorage.setItem(`login-code-verifier`, codeVerifier);
    window.location.assign(authorizationEndpointUrl.href);
  }

  render = () => {
    return (
      <div style={containerStyle}>
        <h1>{Config.websiteName}</h1>
        <AmplifyButton onClick={this.login}>{this.state.text}</AmplifyButton>
      </div>
    )
  }
}

export default App;
