/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { Hub } from 'aws-amplify';
import { BROADCAST_AUTH_CHANNEL, BROADCAST_EVENT } from "../AuthState";
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

class HomePage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isLoadingAuthState: true,
            user: null
        };
        Hub.listen(BROADCAST_AUTH_CHANNEL, this._handleAuthStateChange);
    }

    async componentDidMount() {
        this.props.history.replace('/');
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

    render() {
        let cssClass = "btn btn-primary btn-lg " + Config.colorclass;
        if (this.state.isAuthenticated) {
            return (
                <div className="jumbotron">
                    <h1 className="display-4">Congratulations!</h1>
                    <p className="lead">You have succesfully logged in</p>
                    <p className="lead">
                        <a className={cssClass} href="https://github.com/awslabs/aws-amplify-identity-broker" role="button">See the project on GitHub</a>
                    </p>
                </div>
            );
        }
        else {
            return (
                <div className="jumbotron">
                    <h1 className="display-4">Amplify Identity Broker Sample Client</h1>
                    <p className="lead">This is a sample client for the AWS Amplify Identity Broker Project</p>
                    <p className="lead">
                        <a className={cssClass} href="https://github.com/awslabs/aws-amplify-identity-broker" role="button">See the project on GitHub</a>
                    </p>
                </div>
            );
        }
    }
}

export default withRouter(HomePage);