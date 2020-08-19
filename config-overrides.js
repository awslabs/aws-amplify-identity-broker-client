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
                "flow": "Implicit",
                "responseType": "id_token",
                "brokerUrl": "https://d2zxvlukxu4lhp.cloudfront.net",
                "clientId": "b732cd75872905da60bc202cdc157f22"
            };
                break;
            case "clienttwo": localConfig = {
                "websiteName": "Website 2",
                "colorclass": "color2",
                "flow": "Implicit",
                "responseType": "id_token",
                "brokerUrl": "https://d2zxvlukxu4lhp.cloudfront.net",
                "clientId": "8d5dc691a99f23a6a9b788d618871702"
            };
                break;
            case "clientthre": localConfig = {
                "websiteName": "Website 3",
                "colorclass": "color3",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "https://d2zxvlukxu4lhp.cloudfront.net",
                "clientId": "3ff74008faf102ec0016f99fe311269a"
            };
                break;
            case "clientfour": localConfig = {
                "websiteName": "Website 4",
                "colorclass": "color4",
                "flow": "PKCE",
                "responseType": "code",
                "brokerUrl": "https://d2zxvlukxu4lhp.cloudfront.net",
                "clientId": "e91483525266cff1675e1c719999cc2b"
            };
                break;
            case "liamaws": localConfig = {
                "websiteName": "Website Liam",
                "colorclass": "color1",
                "flow": "Implicit",
                "responseType": "id_token",
                "brokerUrl": "https://d3aj1eqboorjif.cloudfront.net",
                "clientId": "liamaws"
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
            "flow": "Implicit",
            "responseType": "id_token",
            "brokerUrl": "https://d3aj1eqboorjif.cloudfront.net",
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