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
                "flow": "Implicit",
                "responseType": "id_token",
                "brokerUrl": "https://master.dw8p5s05jola3.amplifyapp.com",
                "clientId": "b732cd75872905da60bc202cdc157f22"
            };
                break;
            case "clienttwo": localConfig = {
                "websiteName": "Website 2",
                "colorclass": "color2",
                "flow": "Implicit",
                "responseType": "id_token",
                "brokerUrl": "https://master.dw8p5s05jola3.amplifyapp.com",
                "clientId": "8d5dc691a99f23a6a9b788d618871702"
            };
                break;
            case "clientthre": localConfig = {
                "websiteName": "Website 3",
                "colorclass": "color3",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "https://master.dw8p5s05jola3.amplifyapp.com",
                "clientId": "3ff74008faf102ec0016f99fe311269a"
            };
                break;
            case "clientfour": localConfig = {
                "websiteName": "Website 4",
                "colorclass": "color4",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "https://master.dw8p5s05jola3.amplifyapp.com",
                "clientId": "e91483525266cff1675e1c719999cc2b"
            };
                break;
            case "pprodthre": localConfig = {
                "websiteName": "Preprod 3 PKCE",
                "colorclass": "color3",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "preprod.d35dwu2at8rhkc.amplifyapp.com",
                "clientId": "26f76e074423384a52a9e6f81dc2ed7a"
            };
                break;
            case "pprodone": localConfig = {
                "websiteName": "Preprod 1 Implicit",
                "colorclass": "color1",
                "flow": "Implicit",
                "responseType": "id_token",
                "brokerUrl": "preprod.d35dwu2at8rhkc.amplifyapp.com",
                "clientId": "02d6789ef56270a6d6fcc063cf121b3b"
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
            "responseType": "code",
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