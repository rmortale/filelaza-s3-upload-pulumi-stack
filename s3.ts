import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

let config = new pulumi.Config();
let prefix = config.require("prefix");

const s3bucket = new aws.s3.Bucket(`${prefix}-s3AdapterBucket`);
const s3bucketNotification = new aws.s3.BucketNotification(`${prefix}-s3AdapterNotification`, {
    bucket: s3bucket.id,
    eventbridge: true
});

const sqsbucket = new aws.s3.Bucket(`${prefix}-sqsAdapterBucket`);
const sqsbucketNotification = new aws.s3.BucketNotification(`${prefix}-sqsAdapterNotification`, {
    bucket: sqsbucket.id,
    eventbridge: true
});

export const s3bucketName = s3bucket.id;
export const sqsbucketName = sqsbucket.id;
