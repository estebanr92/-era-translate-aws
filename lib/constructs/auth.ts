import { Construct } from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class AuthConstruct extends Construct {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;
    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.userPool = new cognito.UserPool(this, 'a1bsUserPool', {
            userPoolName: 'a1bsUserPool',
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                username: true,
            },
            passwordPolicy: {
                minLength: 8,
            },
        });
        this.userPoolClient = this.userPool.addClient('a1bsUserPoolClient', {
            userPoolClientName: 'a1bsUserPoolClient',
            authFlows: {
                userSrp: true,
            },
        });
    }
}