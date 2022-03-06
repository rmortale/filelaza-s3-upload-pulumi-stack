import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { bucketName } from "./s3";

let config = new pulumi.Config();
let url = config.require("presignerFunctionUrl");
let prefix = config.require("prefix");


// Configure IAM so that the AWS Lambda can be run.
const role = new aws.iam.Role(`${prefix}-functionRole`, {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: "lambda.amazonaws.com"
    })
});
new aws.iam.RolePolicyAttachment(`${prefix}-funcBasicRoleAttach`, {
    role: role,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
});
new aws.iam.RolePolicyAttachment(`${prefix}-funcS3RoleAttach`, {
    role: role,
    policyArn: aws.iam.ManagedPolicies.AmazonS3FullAccess,
});

// Next, create the Lambda function itself:
const lambda = new aws.lambda.Function(`${prefix}-presigner-function`, {
    code: new pulumi.asset.RemoteArchive(url),
    runtime: aws.lambda.Java11Runtime,
    memorySize: 256,
    timeout: 10,
    role: role.arn,
    handler: "ch.dulce.filelaza.presigner.App::handleRequest",
    environment: {
        variables: {
            BUCKET_NAME: bucketName,
            URL_EXPIRATION_SECONDS: "300"
        },
    },
});

export const presignerFunction = lambda;
