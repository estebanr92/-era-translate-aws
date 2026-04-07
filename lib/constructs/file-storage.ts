import { Construct } from "constructs";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';

export class FileStorageConstruct extends Construct {
    public readonly bucket: s3.Bucket;
    constructor(scope: Construct, id: string){
        super(scope, id);
        this.bucket = new s3.Bucket(this, 'a1bsBucket', {
            versioned: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            cors: [{
                allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.POST],
                allowedOrigins: ['*'],
                allowedHeaders: ['*'],
            }],
        })
    }

}