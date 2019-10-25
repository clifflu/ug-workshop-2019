import cdk = require('@aws-cdk/core');

import { RainFallCrawlerConstruct } from '../constructs/rainFallCrawlerConstruct';
import {IWorkshopStackProps} from "../iWorkshopStackProps";

// @TASK
// 任務一 
// 維持 RainFallCrawlerStack，但透過 bin/app.ts 將其作爲參數帶入 RainFallStack，透過 cdk 交換資訊
// 任務二
// 在 RainFallStack 內引入 RainFallCrawlerConstruct，
// 再開發 Lambda Function 或 Fargate Service 查詢

export class RainFallStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: IWorkshopStackProps) {
    super(scope, id, props);

    // const construct = new RainFallCrawlerConstruct(this, 'RainFallCrawler', {
    //   CwbAuthToken: props.credentials.cwb_token
    // });
  }
}
