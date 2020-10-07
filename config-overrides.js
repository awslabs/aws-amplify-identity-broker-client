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
            case "clientone": localConfig = {
                "websiteName": "Website 1",
                "colorclass": "color1",
                "flow": "PKCE",
                "brokerUrl": "master.dw8p5s05jola3.amplifyapp.com",
                "clientId": "b732cd75872905da60bc202cdc157f22"
            };
                break;
            case "clientthre": localConfig = {
                "websiteName": "Website 2",
                "colorclass": "color2",
                "flow": "PKCE",
                "brokerUrl": "master.dw8p5s05jola3.amplifyapp.com",
                "clientId": "3ff74008faf102ec0016f99fe311269a"
            };
                break;
            case "pprodthre": localConfig = {
                "websiteName": "Preprod 2",
                "colorclass": "color2",
                "flow": "PKCE",
                "brokerUrl": "preprod.d35dwu2at8rhkc.amplifyapp.com",
                "clientId": "5baiv9tcsk25b6un85ln51jeri"
            };
                break;
            case "pprodone": localConfig = {
                "websiteName": "Preprod 1",
                "colorclass": "color1",
                "flow": "PKCE",
                "brokerUrl": "preprod.d35dwu2at8rhkc.amplifyapp.com",
                "clientId": "vou3a4epvi0edpnfr2528a0kl"
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
            "brokerUrl": "preprod.d35dwu2at8rhkc.amplifyapp.com",
            "clientId": "dev-a74f71067496caa729af7ffedf400504"
        };
    }

    if (!config.externals) {
        config.externals = {};
    }
    config.externals.Config = JSON.stringify(localConfig);

    return config;
}