import { Construct } from "constructs";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";

interface LambdaProps {
    table: dynamodb.Table
    bucket: s3.Bucket
}


export class LambdaConstruct extends Construct {

    public readonly saveUserData: lambda.Function;
    public readonly getUserData: lambda.Function;
    public readonly askBedrock: lambda.Function;
    public readonly saveBedrockSuggestion: lambda.Function;
    public readonly getUserSuggestions: lambda.Function;


    constructor(scope: Construct, id: string, props: LambdaProps){
        super(scope, id);

        this.saveUserData = new lambda.Function(this, 'SaveUserData', {
            runtime: lambda.Runtime.NODEJS_24_X,
            handler: 'saveUserData.handler',
            code: lambda.Code.fromAsset('lambda/user'),
            environment: {
                TABLE_NAME: props.table.tableName,
                BUCKET_NAME: props.bucket.bucketName
            }
        });

        this.getUserSuggestions = new lambda.Function(this, 'GetUserSuggestions', {
            runtime: lambda.Runtime.NODEJS_24_X,
            handler: 'getUserSuggestions.handler',
            code: lambda.Code.fromAsset('lambda/user'),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        this.getUserData = new lambda.Function(this, 'GetUserData', {
            runtime: lambda.Runtime.NODEJS_24_X,
            handler: 'getUserData.handler',
            code: lambda.Code.fromAsset('lambda/user'),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        this.askBedrock = new lambda.Function(this, 'AskBedrock', {
            runtime: lambda.Runtime.NODEJS_24_X,
            handler: 'askBedrock.handler',
            code: lambda.Code.fromAsset('lambda/bedrock'),
        })

        this.askBedrock.addToRolePolicy(new iam.PolicyStatement({
            actions: ['bedrock:InvokeModel'],
            resources: ['arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0'] 
        }));


        this.saveBedrockSuggestion = new lambda.Function(this, 'SaveBedrockSuggestion', {
            runtime: lambda.Runtime.NODEJS_24_X,
            handler: 'askBedrock.saveBedrockSuggestion',
            code: lambda.Code.fromAsset('lambda/bedrock'),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        props.table.grantWriteData(this.saveBedrockSuggestion);
        props.table.grantWriteData(this.saveUserData);
        props.table.grantReadData(this.getUserData);
        props.table.grantReadData(this.getUserSuggestions);
        props.bucket.grantRead(this.getUserData)
        props.bucket.grantWrite(this.saveUserData);

    }

}