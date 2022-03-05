import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const env = pulumi.getStack();
const prj = "filelaza";
const puprj = pulumi.getProject();
const prefix = `${prj}-${puprj}-${env}`;

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket(`${prefix}-uploads`);

// Export the name of the bucket
export const bucketName = bucket.id;
