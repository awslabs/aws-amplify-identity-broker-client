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
                "websiteName": "Website 3",
                "color": "#F00",
                "brokerUrl": "https://d23vbzcww6xd16.cloudfront.net",
                "baseUrl": "https://master.dv7odw7xb73ou.amplifyapp.com",
                "clientId": "b732cd75872905da60bc202cdc157f22"
            };
                break;
            case "clienttwo": localConfig = {
                "websiteName": "Website 4",
                "color": "#0F0",
                "brokerUrl": "https://d23vbzcww6xd16.cloudfront.net",
                "baseUrl": "https://master.dvj34ijv8eg6m.amplifyapp.com",
                "clientId": "8d5dc691a99f23a6a9b788d618871702"
            };
                break;
            default:
                console.error("Trying to build an unknown Amplify env config");
                process.exit();
        }
    } else { // Local developement settings
        localConfig = {
            "websiteName": "Website local",
            "color": "#FF0",
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