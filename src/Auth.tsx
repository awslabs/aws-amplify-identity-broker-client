/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 
Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
or in the "license" file accompanying this file. This file is distributed 
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either 
express or implied. See the License for the specific language governing 
permissions and limitations under the License. */

import jwt_decode from 'jwt-decode';
import crypto from "crypto";
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

function base64URLEncode(buffer: Buffer): string {
    return buffer.toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function sha256(str: string): Buffer {
    return crypto.createHash("sha256").update(str).digest();
}

class Auth {
    settings: any;
    accessToken?: any;
    idToken?: any;
    userInfo?: any;
    loggedin?: any;

    constructor() {
        this.settings = {
            idBrokerUrl: Config.brokerUrl,
            clientID: Config.clientId,
            redirectUri: window.location.origin,
            responseType: Config.responseType // code or id_token
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);

        var idToken = localStorage.getItem(`idToken`);
        if (idToken) {
            var idTokenDecoded = jwt_decode(idToken);
            if (this.settings.responseType === 'code') {
                var accessToken = localStorage.getItem(`accessToken`);
                if (accessToken) {
                    this.accessToken = accessToken;
                    this.idToken = idToken;
                    this.userInfo = idTokenDecoded;
                    this.loggedin = true;
                }
            }
            else if (this.settings.responseType === 'id_token') {
                this.idToken = idToken;
                this.userInfo = idTokenDecoded;
                this.loggedin = true;
            }
        }
    }

    login() {
        const authorizationEndpointUrl = new URL(this.settings.idBrokerUrl + '/oauth2/authorize');

        if (this.settings.responseType === 'id_token') {
            authorizationEndpointUrl.search = new URLSearchParams({
                redirect_uri: this.settings.redirectUri,
                client_id: this.settings.clientID,
                response_type: this.settings.responseType,
            }).toString();
        }
        else if (this.settings.responseType === 'code') {
            var codeVerifier = base64URLEncode(crypto.randomBytes(32));
            var codeChallenge = base64URLEncode(sha256(codeVerifier));
            authorizationEndpointUrl.search = new URLSearchParams({
                redirect_uri: this.settings.redirectUri,
                client_id: this.settings.clientID,
                response_type: this.settings.responseType,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            }).toString();
            localStorage.setItem(`login-code-verifier`, codeVerifier);
        }

        window.location.assign(authorizationEndpointUrl.href);
    }

    logout() {
        this.accessToken = null;
        this.idToken = null;
        this.userInfo = null;
        this.loggedin = null;
        localStorage.removeItem('idToken');
        localStorage.removeItem('accessToken');
    }

    async handleAuth() {
        const queryStringParams = new URLSearchParams(window.location.search);
        var idToken = null;
        if (queryStringParams.has('id_token')) {
            idToken = queryStringParams.get('id_token');
        }
        else if (queryStringParams.has('code')) {
            const code: string = queryStringParams.get('code')!.toString();
            const code_verifier: string | null = localStorage.getItem(`login-code-verifier`);
            if (!code_verifier) {
                console.error('No login code verifier in session storage');
                return;
            }

            const tokenSet = await fetch(this.settings.idBrokerUrl + '/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: this.settings.clientID,
                    redirect_uri: this.settings.redirectUri,
                    code_verifier: code_verifier,
                    authorization_code: code,
                }),
                headers: new Headers({
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                })
            }).then(r => r.json());
            idToken = tokenSet.id_token;
            this.accessToken = tokenSet.access_token;
            localStorage.setItem(`accessToken`, tokenSet.access_token);
        }
        else {
            return;
        }
        var idTokenDecoded = jwt_decode(idToken);
        this.idToken = idToken;
        this.userInfo = idTokenDecoded;
        this.loggedin = true;
        localStorage.setItem(`idToken`, idToken);
    }

    isLoggedIn() {
        return this.loggedin;
    }

    getUserInfo() {
        return this.userInfo;
    }
}

const authClient = new Auth();

export default authClient;