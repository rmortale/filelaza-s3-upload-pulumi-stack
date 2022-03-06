import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { bucketName } from "./s3";

let config = new pulumi.Config();
let prefix = config.require("prefix");

const log = new aws.cloudwatch.LogGroup(`/aws/events/${prefix}-s3-upload-events-log`, {
    retentionInDays: 7
});

const objCreated = new aws.cloudwatch.EventRule(`${prefix}-s3ObjectCreated`, {
    description: "Capture each S3 object created event",
    eventPattern: bucketName.apply(name =>
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

const eventTarget = new aws.cloudwatch.EventTarget(`${prefix}-event-target`, {
    rule: objCreated.name,
    targetId: "SendToLog",
    arn: log.arn,
});

export const logGroup = log.id;
