import path = require('path');

import cdk = require('@aws-cdk/core');

import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import {FollowMode} from "@aws-cdk/assets";

export class EchoConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const lambdaFunction = new lambda.Function(this, 'echoFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handle',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../assets/echo'),
        {follow: FollowMode.EXTERNAL}
      ),
      timeout: cdk.Duration.seconds(60)
    });

    const api = new apigateway.RestApi(this, 'echoApi', {
      restApiName: 'echo'
    });

    const echoApiIntegration = new apigateway.LambdaIntegration(
      lambdaFunction,
      { requestTemplates: {
        'application/json': '{"statusCode": "200"}'
      }}
    );

    api.root.resourceForPath('/echo').addMethod("GET", echoApiIntegration);
  }
}
