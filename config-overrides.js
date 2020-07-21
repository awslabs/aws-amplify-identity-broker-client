/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 
Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at
 
    http://www.apache.org/licenses/LICENSE-2.0
 
or in the "license" file accompanying this file. This file is distributed 
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either 
express or implied. See the License for the specific language governing 
permissions and limitations under the License. */

var amplifyMeta = {};
const fs = require("fs");
if (!fs.existsSync("./amplify/backend/amplify-meta.json")) {
    console.error("Amplify is not configured !!");
    console.log(" please run:");
    console.log(" > amplify init");
    console.log(" Select an existing environment (choose dev to start)");
    process.exit();
} else {
    amplifyMeta = require("./amplify/backend/amplify-meta.json");
}
const REGEX = /.*-(\w+)/;
const AMPLIFY_ENV = amplifyMeta.hosting.S3AndCloudFront.output.HostingBucketName.match(REGEX)[1];

console.log("Injecting config");
console.log("AMPLIFY_ENV is " + AMPLIFY_ENV);

module.exports = function override(config, env) {
    console.log("Build env is " + env);
    let localConfig = {};
    if (env !== "development") {
        console.log("This is an AWS build");
        switch (AMPLIFY_ENV) {
            case "clientone": localConfig = {
                "websiteName": "Website 1",
                "colorclass": "color1",
                "flow": "implicit",
                "responseType": "id_token",
                "brokerUrl": "https://d23vbzcww6xd16.cloudfront.net",
                "baseUrl": "https://master.dv7odw7xb73ou.amplifyapp.com",
                "clientId": "b732cd75872905da60bc202cdc157f22"
            };
                break;
            case "clienttwo": localConfig = {
                "websiteName": "Website 2",
                "colorclass": "color2",
                "flow": "implicit",
                "responseType": "id_token",
                "brokerUrl": "https://d23vbzcww6xd16.cloudfront.net",
                "baseUrl": "https://master.dvj34ijv8eg6m.amplifyapp.com",
                "clientId": "8d5dc691a99f23a6a9b788d618871702"
            };
                break;
            case "clientthre": localConfig = {
                "websiteName": "Website 3",
                "colorclass": "color3",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "https://d23vbzcww6xd16.cloudfront.net",
                "baseUrl": "https://master.dgt79y8acfq6b.amplifyapp.com",
                "clientId": "3ff74008faf102ec0016f99fe311269a"
            };
                break;
            case "clientfour": localConfig = {
                "websiteName": "Website 4",
                "colorclass": "color4",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "https://d23vbzcww6xd16.cloudfront.net",
                "baseUrl": "https://master.d3uilst39vffn1.amplifyapp.com",
                "clientId": "e91483525266cff1675e1c719999cc2b"
            };
                break;
            case "liamaws": localConfig = {
                "websiteName": "Website Liam",
                "colorclass": "color4",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "https://d39rd8fyh5azgs.cloudfront.net",
                "clientId": "liam123"
            };
                break;
            default:
                console.error("Trying to build an unknown Amplify env config");
                process.exit();
        }
    } else { // Local developement settings
        localConfig = {
            "websiteName": "Website local",
            "colorclass": "color4",
            "flow": "PKCE",
            "responseType": "code",
            "brokerUrl": "https://d23vbzcww6xd16.cloudfront.net",
            "baseUrl": "https://localhost:3000",
            "clientId": "dev-a74f71067496caa729af7ffedf400504"
        };
    }

    if (!config.externals) {
        config.externals = {};
    }
    config.externals.Config = JSON.stringify(localConfig);

    return config;
}