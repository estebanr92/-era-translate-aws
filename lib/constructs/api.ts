import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';


interface ApiConstructProps {
    userPool: cognito.UserPool,
    saveUserData: lambda.Function,
    getUserData: lambda.Function,
    askBedrock: lambda.Function,
    saveBedrockSuggestion: lambda.Function,
    getUserSuggestions: lambda.Function,
}

export class ApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ApiConstructProps) {
        super(scope, id);
        const applicationAPI = new apigateway.RestApi(this, 'a1bsAPI');
        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
            this, 'CognitoAuth', 
            {
                cognitoUserPools: [props.userPool]
            }
        )
        const userRoute = applicationAPI.root.addResource('/user')
        const suggestionsRoute = userRoute.addResource('/suggestions')
        const aiRoute = applicationAPI.root.addResource('/ai')
        const saveUserDataLI = new apigateway.LambdaIntegration(props.saveUserData);
        const getUserDataLI = new apigateway.LambdaIntegration(props.getUserData);
        const askBedrockLI = new apigateway.LambdaIntegration(props.askBedrock);
        const saveBedrockSuggestionLI = new apigateway.LambdaIntegration(props.saveBedrockSuggestion);
        const getUserSuggestionsLI = new apigateway.LambdaIntegration(props.getUserSuggestions);


        userRoute.addMethod("POST", saveUserDataLI, {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        })

        userRoute.addMethod("GET", getUserDataLI, {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        })

        suggestionsRoute.addMethod("GET", getUserSuggestionsLI, {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        })

        suggestionsRoute.addMethod("POST", saveBedrockSuggestionLI, {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        })

        aiRoute.addMethod("POST", askBedrockLI, {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        })
    }
}