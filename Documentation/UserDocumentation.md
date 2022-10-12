# User Documentation <!-- omit in toc -->

- [Deployment](#deployment)
  - [Deployment Instructions](#deployment-instructions)
- [Uninstall](#uninstall)
  - [Stack deletion](#stack-deletion)

This document explains how to use the broker:

* How to deploy (and uninstall)

## Deployment

### Deployment Instructions

__Prerequisites :__ In order to deploy the solution you need:
* an AWS account
* the AWS CLI installed with administrator credentials ([installation-link](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html))
* the AWS Amplify CLI ([installation link](https://docs.amplify.aws/cli/start/install)), install and configure.

__1. Clone the project or fork it__

```
git clone git@github.com:awslabs/aws-amplify-identity-broker-client.git
```

__Note__: _If you want to save your modification and settings under Git your should [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) this repository and work from your fork. You can also start with a clone, fork and add your fork as another remote._

__2. Install all the dependencies__

```
cd aws-amplify-identity-broker-client
npm install
```

__3. Delete the AWS demo environment file__

Remove the file with the AWS dev & demo environment (amplify will create a new file with your environment information later)

```
rm -f ./amplify/team-provider-info.json
```

__4. Initialize your environment__

_You need to have the AWS cli and AWS credentials in place before running this_

```
amplify init
```

__5. Configure Parameters__

Update bucket name in `amplify/backend/hosting/S3AndCloudFront/parameters.json` to something unique. For example, 

```
{
    "bucketName": "brokerclient-20221001-client-<yourname>"
}
```

__6. Configure config-overrides.js__

The file _config-overrides.js_ is used at compile time to configure the Single Page App. Edit the file and add the settings for your environment:

```
    case "prod": localConfig = {                         // Env Name
        "websiteName": "Website 1",                         // Website Name on Navbar
        "colorclass": "color1",                             // Theme Color: [color1, color2, color3, color4]
        "flow": "PKCE",                                     // Authentication Flow: [Implicit, PKCE]
        "brokerUrl": "master.d2i2y50c8btsz.amplifyapp.com", // URL of AmplifyIdentityBroker
        "clientId": "7dtbkbjit44foa2vj3pb34a99s"            // Cognito Client ID of Amplify Identity Broker
    };
```

Additionally, region prefix of `userPoolId` in `src/App.tsx` must be set to correct region.

```
Auth.configure({
  userPoolId: "us-west-2_XXXXXXXXX", // This won"t be used but region should be correct
  userPoolWebClientId: Config.clientId,
  oauth: {
    domain: Config.brokerUrl,
    scope: ["email", "profile", "openid"],
    redirectSignIn: domain,
    redirectSignOut: domain,
    responseType: "code",
  },
})
```

__7. Publish the app__

This command will create all the backend resources and the hosting bucket plus cloudfront distribution that will host the broker:

```
amplify publish
```

## Uninstall

> __Important note:__ the stack deletion will not delete all the resources to prevent accidental data loss. Especially, the UserPool won't be deleted by a stack deletion. If you really want to delete the user pool do the Step2 after the Step1.

### Stack deletion

To delete the broker, you have to run the following command:
```
amplify delete
```

Or if you have multiple environments in your _amplify/team-provider-info.json_ you will run multiple time commands like:
```
amplify env remove <name-of-your-env>
```
_Note: You cannot delete an environment currently checkout, you'll have to switch env before with `amplify env checkout <my-other-env>`. At anytime you can see the list of env by typing `amplify env list`_

> __Possible cause of failure:__
> * __S3 bucket not empty:__ To solve this, in the AWS console, go to Amazon S3, open the S3 bucket that fail to delete, check all items and click delete. Then redo the stack deletion (using the AWS Amplify CLI or AWS CloudFormation)

__Alternative method: AWS Cloudformation__

Alternatively of using the AWS Amplify CLI is to go to AWS CloudFormation in the region where you have created the environment and deleting the root stack. This  ensures that all the resources created by that stack are removed.

__AWS Amplify console__

If you deployed your environment through the AWS Amplify console, then you should delete it from the AWS Amplify console.
