import cdk = require('@aws-cdk/core');

import { RainFallCrawlerConstruct } from '../constructs/rainFallCrawlerConstruct';
import {IWorkshopStackProps} from "../iWorkshopStackProps";

export class RainFallCrawlerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: IWorkshopStackProps) {
    super(scope, id, props);

    const construct = new RainFallCrawlerConstruct(this, 'RainFallCrawler', {
      CwbAuthToken: props.credentials.cwb_token
    });
  }
}
