/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

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
let AMPLIFY_ENV = "";
if (amplifyMeta.hosting.S3AndCloudFront.output && amplifyMeta.hosting.S3AndCloudFront.output.HostingBucketName) {
    AMPLIFY_ENV = amplifyMeta.hosting.S3AndCloudFront.output.HostingBucketName.match(REGEX)[1];
} else {
    console.log("Not able to find Amplify env. Use local dev settings");
}

console.log("Injecting config");
console.log("AMPLIFY_ENV is " + AMPLIFY_ENV);

module.exports = function override(config, env) {
    console.log("Build env is " + env);
    let localConfig = {};
    if (env !== "development") {
        console.log("This is an AWS build");
        switch (AMPLIFY_ENV) {
            case "prodone": localConfig = {
                "websiteName": "Website 1",
                "colorclass": "color1",
                "flow": "PKCE",
                "brokerUrl": "master.d2i2y50c8btsz.amplifyapp.com",
                "clientId": "7dtbkbjit44foa2vj3pb34a99s"
            };
                break;
            case "prodtwo": localConfig = {
                "websiteName": "Website 2",
                "colorclass": "color2",
                "flow": "PKCE",
                "brokerUrl": "master.d2i2y50c8btsz.amplifyapp.com",
                "clientId": "2ufj8gfjk99sgdunbll4df35bj"
            };
                break;
            case "devone": localConfig = {
                "websiteName": "Website 1 (Dev)",
                "colorclass": "color1",
                "flow": "PKCE",
                "brokerUrl": "dev.d19evjq5d10l2l.amplifyapp.com",
                "clientId": "61ksp5cgn88426mftft0bgjrfd"
            };
                break;
            case "devtwo": localConfig = {
                "websiteName": "Website 2 (Dev)",
                "colorclass": "color2",
                "flow": "PKCE",
                "brokerUrl": "dev.d19evjq5d10l2l.amplifyapp.com",
                "clientId": "1qvvl6e8qv2tjmv8bknragmn7u"
            };
                break;
            default:
                console.error("Trying to build an unknown Amplify env config");
                process.exit();
        }
    } else { // Local developement settings
        localConfig = {
            "websiteName": "Website Local",
            "colorclass": "color1",
            "flow": "PKCE",
            "brokerUrl": "dev.d19evjq5d10l2l.amplifyapp.com",
            "clientId": "3oqqr30qatsop1uobbv74a6civ"
        };
    }

    if (!config.externals) {
        config.externals = {};
    }
    config.externals.Config = JSON.stringify(localConfig);

    return config;
}