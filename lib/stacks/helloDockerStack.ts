import cdk = require('@aws-cdk/core');

import path = require('path');

import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');

export class HelloDockerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, 'EcsCluster', {
      vpc
    });

    // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecs-patterns.ApplicationLoadBalancedFargateService.html
    const albFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'AlbFargateService',
      {
        cluster,
        taskImageOptions: {
          containerPort: 8080,
          image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../assets/helloDocker'))
        }
      }
    );

    // 刪除這個 Stack 需要比較長的時間，也許數分鐘；爲什麼？

    // @TASK 參考主控臺中 CloudFormation 所創建的資源；
    // 你能否透過調整上述資源 (vpc, cluster, albFargateService) ，讓這個 Stack 不需要使用 NatGateway?
  }
}
