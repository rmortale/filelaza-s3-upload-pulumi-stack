import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { s3bucketName, sqsbucketName } from "./s3";

let config = new pulumi.Config();
let prefix = config.require("prefix");

const log = new aws.cloudwatch.LogGroup(`/aws/events/${prefix}-s3-upload-events-log`, {
    retentionInDays: 7
});

const s3objCreated = new aws.cloudwatch.EventRule(`${prefix}-s3ObjectCreated`, {
    description: "Capture each S3 object created event",
    eventPattern: s3bucketName.apply(name =>
        JSON.stringify({
            "source": ["aws.s3"],
            "detail-type": ["Object Created"],
            "detail": {
                "bucket": {
                    "name": [name]
                }
            }
        })
    )
});

const sqsobjCreated = new aws.cloudwatch.EventRule(`${prefix}-sqsbjectCreated`, {
    description: "Capture each S3 object created event",
    eventPattern: sqsbucketName.apply(name =>
        JSON.stringify({
            "source": ["aws.s3"],
            "detail-type": ["Object Created"],
            "detail": {
                "bucket": {
                    "name": [name]
                }
            }
        })
    )
});

const s3eventTarget = new aws.cloudwatch.EventTarget(`${prefix}-s3-event-target`, {
    rule: s3objCreated.name,
    targetId: "SendToLogS3",
    arn: log.arn,
});

const eventTarget = new aws.cloudwatch.EventTarget(`${prefix}-sqs-event-target`, {
    rule: sqsobjCreated.name,
    targetId: "SendToLogSqs",
    arn: log.arn,
});

export const logGroup = log.id;
