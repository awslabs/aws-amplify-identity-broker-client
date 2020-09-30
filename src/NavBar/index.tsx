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
import { Auth } from 'aws-amplify';
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

type NavBarState = {
    isLoggedIn: boolean,
    userInfo: any
}

class NavBar extends React.Component<any, NavBarState> {
    constructor(props: any) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userInfo: undefined
        }
    }

    logout = () => {
        Auth.signOut();
        this.props.history.replace('/');
        this.setState({ isLoggedIn: false });
    };

    async componentDidMount() {
        this.props.history.replace('/');
        let userInfo = await Auth.currentUserInfo();
        console.log(userInfo);
        if(userInfo !== null) {
            this.setState({ isLoggedIn: true, userInfo: userInfo });
        } else {
            this.setState({ isLoggedIn: false, userInfo: undefined });
        }
    }

    render() {
        let cssClass = "navbar navbar-dark " + Config.colorclass + " fixed-top";
        return (
            < nav className={cssClass} >
                <Link className="navbar-brand" to="/">
                    {Config.websiteName} - Sample {Config.flow} Client
      </Link>
                {
                    !this.state.isLoggedIn &&
                    < button className="btn btn-dark" onClick={() => { Auth.federatedSignIn() }}>Log In</button>
                }
                {
                    this.state.isLoggedIn &&
                    < div >
                        <label className="mr-2 text-white">You are logged in as: { /*this.state.userInfo.email*/ }</label>
                        <button className="btn btn-link" onClick={() => { Auth.federatedSignIn() }}>Switch User</button>&nbsp;&nbsp;
                        <button className="btn btn-dark" onClick={() => { this.logout() }}>Log Out</button>
                    </div >
                }
            </nav >
        );
    }
}

export default withRouter(NavBar);