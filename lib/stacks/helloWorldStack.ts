import cdk = require('@aws-cdk/core');

import dynamodb = require('@aws-cdk/aws-dynamodb');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'DynamoDbTable', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {name: 'pk', type: dynamodb.AttributeType.STRING},
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      sortKey: {name: 'sk', type: dynamodb.AttributeType.NUMBER}
    });

    // Role
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.AccountPrincipal(this.account),
    });

    table.grantReadWriteData(role);

    // 利用 Lookup 取出已經存在的 Vpc；資料會快取在 cdk.context.json 中
    // const vpcDefault = ec2.Vpc.fromLookup(this, 'Vpc', {
    //   vpcName: 'default'
    // })
  }
}
