/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 
Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
or in the "license" file accompanying this file. This file is distributed 
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either 
express or implied. See the License for the specific language governing 
permissions and limitations under the License. */

import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import authClient from '../Auth';
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

class NavBar extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    logout = () => {
        authClient.logout();
        this.props.history.replace('/');
    };

    render() {
        let cssClass = "navbar navbar-dark " + Config.colorclass + " fixed-top";
        return (
            < nav className={cssClass} >
                <Link className="navbar-brand" to="/">
                    {Config.websiteName} - sample {Config.flow} client
      </Link>
                {
                    !authClient.isLoggedIn() &&
                    < button className="btn btn-dark" onClick={authClient.login}>Log In</button>
                }
                {
                    authClient.isLoggedIn() &&
                    < div >
                        <label className="mr-2 text-white">Your are logged in as: {authClient.getUserInfo().email}</label>
                        <button className="btn btn-dark" onClick={() => { this.logout() }}>Log Out</button>
                    </div >
                }
            </nav >
        );
    }
}

export default withRouter(NavBar);