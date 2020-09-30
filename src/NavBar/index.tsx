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
import { Hub, Auth } from 'aws-amplify';
import { BROADCAST_AUTH_CHANNEL, BROADCAST_EVENT } from "../AuthState";

// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

class NavBar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isLoadingAuthState: true,
            user: null
        };
        Hub.listen(BROADCAST_AUTH_CHANNEL, this._handleAuthStateChange);
    }

    _handleAuthStateChange = (hubCapsule: any) => {
        switch (hubCapsule.payload.event) {
            case BROADCAST_EVENT[BROADCAST_EVENT.LOADING]:
                this.setState({isLoadingAuthState : true});
                break;
            case BROADCAST_EVENT[BROADCAST_EVENT.UPDATED]:
                this.setState({
                    isLoadingAuthState : false,
                    isAuthenticated: hubCapsule.payload.data.isAuthenticated,
                    user: hubCapsule.payload.data.user
                });
                break;
            default:
                break;
        }
    }

    logout = () => {
        Auth.signOut();
    };

    render() {
        let cssClass = "navbar navbar-dark " + Config.colorclass + " fixed-top";
        return (
            < nav className={cssClass} >
                <Link className="navbar-brand" to="/">
                    {Config.websiteName} - Sample {Config.flow} Client
      </Link>
                {
                    !this.state.isAuthenticated &&
                    !this.state.isLoadingAuthState &&
                    < button className="btn btn-dark" onClick={() => { Auth.federatedSignIn() }}>Log In</button>
                }
                {
                    this.state.isAuthenticated &&
                    !this.state.isLoadingAuthState &&
                    < div >
                        <label className="mr-2 text-white">You are logged in as: { this.state.user.attributes.email }</label>
                        <button className="btn btn-dark" onClick={() => { this.logout() }}>Log Out</button>
                    </div >
                }
            </nav >
        );
    }
}

export default withRouter(NavBar);