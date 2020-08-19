/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import authClient from '../Auth';
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

class NavBar extends React.Component<any> {
    logout = () => {
        authClient.logout();
        this.props.history.replace('/');
    };

    render() {
        let cssClass = "navbar navbar-dark " + Config.colorclass + " fixed-top";
        return (
            < nav className={cssClass} >
                <Link className="navbar-brand" to="/">
                    {Config.websiteName} - Sample {Config.flow} Client
      </Link>
                {
                    !authClient.isLoggedIn() &&
                    < button className="btn btn-dark" onClick={() => { authClient.login() }}>Log In</button>
                }
                {
                    authClient.isLoggedIn() &&
                    < div >
                        <label className="mr-2 text-white">You are logged in as: {authClient.getUserInfo().email}</label>
                        <button className="btn btn-link" onClick={() => { authClient.login("/logout") }}>Switch User</button>&nbsp;&nbsp;
                        <button className="btn btn-dark" onClick={() => { this.logout() }}>Log Out</button>
                    </div >
                }
            </nav >
        );
    }
}

export default withRouter(NavBar);