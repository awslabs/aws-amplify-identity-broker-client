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
import { withRouter } from 'react-router-dom';
import authClient from '../Auth';
// THIS LINE HAS TO BE AT THE END OF IMPORTS:
var Config = require("Config");

class HomePage extends React.Component<any> {
    render() {
        if (authClient.isLoggedIn()) {
            return (
                <div className="jumbotron">
                    <h1 className="display-4">Congratulations!</h1>
                    <p className="lead">You have succesfully logged in using the {Config.flow} flow</p>
                    <p className="lead">
                        <a className="btn btn-primary btn-lg" href="https://github.com/xavierraffin/amplify-identity-broker" role="button">See the project on GitHub</a>
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
                        <a className="btn btn-primary btn-lg" href="https://github.com/xavierraffin/amplify-identity-broker" role="button">See the project on GitHub</a>
                    </p>
                </div>
            );
        }
    }
}

export default withRouter(HomePage);