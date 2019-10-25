import cdk = require('@aws-cdk/core');

import { EchoConstruct } from '../constructs/echoConstruct';

export class EchoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new EchoConstruct(this, 'EchoConstruct')
  }
}
