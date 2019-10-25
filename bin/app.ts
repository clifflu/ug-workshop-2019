#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { IWorkshopStackProps } from '../lib/iWorkshopStackProps';

import { HelloWorldStack } from '../lib/stacks/helloWorldStack'
import { EchoStack } from '../lib/stacks/echoStack'
import { RainFallCrawlerStack } from '../lib/stacks/rainFallCrawlerStack';
import { HelloDockerStack } from "../lib/stacks/helloDockerStack";
import { RainFallStack } from "../lib/stacks/rainFallStack";

const stackProps:IWorkshopStackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_DEFAULT_REGION
  },
  credentials: {
    // @TASK
    // 填入從 CWB 取得的授權碼，cdk 會將 credential 以不怎麼安全的方式帶入 Lambda / Fargate
    cwb_token: process.env.CWB_TOKEN || ''
  }
};

const prefix = 'workshop1026';
const app = new cdk.App();

new HelloWorldStack(app, `${prefix}HelloWorld`, stackProps);
new EchoStack(app, `${prefix}Echo`, stackProps);
new RainFallCrawlerStack(app, `${prefix}RainFallCrawler`, stackProps);
new HelloDockerStack(app, `${prefix}HelloDocker`, stackProps);

new RainFallStack(app, `${prefix}RainFall`, stackProps);

