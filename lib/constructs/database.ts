import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib/core';

export class DatabaseConstruct extends Construct {
  public readonly table: dynamodb.Table;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.table = new dynamodb.Table(this, 'a1bsTable', {
        partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}