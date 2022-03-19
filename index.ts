import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { presignerFunction } from "./lambda";
import { logGroup } from "./eventbridge";
import { s3bucketName, sqsbucketName } from "./s3";

let config = new pulumi.Config();
let prefix = config.require("prefix");


// Give API Gateway permissions to invoke the Lambda
const lambdapermission = new aws.lambda.Permission(`${prefix}-lambdaPermission`, {
    action: "lambda:InvokeFunction",
    principal: "apigateway.amazonaws.com",
    function: presignerFunction,
});

// Set up the API Gateway
const apigw = new aws.apigatewayv2.Api(`${prefix}-httpApiGateway`, {
    protocolType: "HTTP",
    routeKey: "GET /",
    target: presignerFunction.invokeArn,
});

export const endpoint = apigw.apiEndpoint;
export const log = logGroup;
export const s3bucket = s3bucketName;
export const sqsbucket = sqsbucketName;

