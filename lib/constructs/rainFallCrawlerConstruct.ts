import path = require('path');

import cdk = require('@aws-cdk/core');

import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');

import {FollowMode} from "@aws-cdk/assets";

export interface RainFallCrawlerConstructProps {
  CwbAuthToken: string
}

export class RainFallCrawlerConstruct extends cdk.Construct {
  // DynamoDB Table for crawled historical rain fall
  rainFallTable: dynamodb.Table;

  // The crawler to read from CWB
  crawlerFunction: lambda.Function; // blah

  constructor(scope: cdk.Construct, id: string, props: RainFallCrawlerConstructProps) {
    if (!props.CwbAuthToken) {
      throw new Error("props.AuthToken must not be falsy")
    }

    super(scope, id);

    // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-dynamodb.Table.html
    this.rainFallTable = new dynamodb.Table(this, 'RainFallTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {name: 'location', type: dynamodb.AttributeType.STRING},
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      sortKey: {name: 'date', type: dynamodb.AttributeType.NUMBER}
    });

    // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda.Function.html
    this.crawlerFunction = new lambda.Function(this, 'CrawlerFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handle',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../assets/rainFallCrawler'),
        {follow: FollowMode.EXTERNAL}
      ),
      environment: {
        RainFallTableName: this.rainFallTable.tableName,
        CwbAuthToken: props.CwbAuthToken
      },
      memorySize: 256,
      timeout: cdk.Duration.seconds(60)
    });

    this.rainFallTable.grantReadWriteData(this.crawlerFunction)

    // @TASK 若要每天自動執行一次 crawlerFunction 該怎麼做？
    // Hint: CloudWatch Events 在 CDK 中稱作 aws-events，提供高階 Construct `Rule`
    // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-events.Rule.html

  }
}
