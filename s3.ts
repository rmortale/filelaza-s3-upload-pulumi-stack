import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

let config = new pulumi.Config();
let prefix = config.require("prefix");

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket(`${prefix}-uploads`);
const bucketNotification = new aws.s3.BucketNotification("bucketNotification", {
    bucket: bucket.id,
    eventbridge: true
});

export const bucketName = bucket.id;
