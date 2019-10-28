# ug-workshop-2019

AWS User Group Taiwan 在 AWS & Twitch Hack‘n'Roll Workshop 的訓練教程專案。
演示利用 AWS CDK 開發 Lambda 與 Fargate 應用程式，並利用其他 AWS 服務解決問題。

## Prerequisites

* [git](https://git-scm.com/)
* [nodejs](https://nodejs.org/)
* [docker](https://www.docker.com/)
  * Mac 可安裝 [Docker Desktop](https://www.docker.com/products/docker-desktop)
  * Windows 若未包含 Hyper-V 可安裝 [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/)
* [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
`% npm install -g cdk`
* 註冊 [氣象資料開放平臺](https://opendata.cwb.gov.tw/index) 會員並取得授權碼

## Usage

先在專案目錄下執行 `npm run installll` 以安裝專案與 asset 的套件。

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
