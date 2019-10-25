const AWS = require('aws-sdk');
const rp = require('request-promise');

// 氣象局 API 授權碼
const CWB_TOKEN = process.env.CwbAuthToken;

// 表格名稱
const TableName = process.env.RainFallTableName;

// 儲存 處理進度 的 DynamoDB Table Key
const LAST_PROCESSED_DDB_KEY = {
  location: {S: 'metadata'},
  date: {N: '0'}
};

/**
 * 自中央氣象局取得累積雨量
 * https://opendata.cwb.gov.tw/dataset/climate/C-B0025-001
 *
 * @returns {Promise<*>}
 */
async function fetchRainFall() {
  const uri = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/C-B0025-001?format=JSON';
  const qs = {
    format: 'JSON',
    Authorization: CWB_TOKEN
  };

  return rp({uri, qs}).then(
    (d) => JSON.parse(d).cwbopendata.dataset.location
  )
}

/**
 * 生成 AWS SDK DynamoDB handle
 * @returns {DynamoDB}
 */
function ddb() {
  return new AWS.DynamoDB({
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
  });
}

/**
 * 將 'YYYY-mm-dd' 一類的日期轉換爲數字，維持大小關係，同一天總是對應到同一個數字
 * 且近代日期對應道德的值都 > 0
 *
 * @param s 表示 Date 的字串，格式爲 'YYYY-mm-dd'
 */
function dateNumberFromString(s) {
  return Math.floor(
    (new Date(s)).valueOf() / 86400000
  );
}

/**
 * 自 DynamoDB 取回處理進度，若沒有值則回傳 0
 *
 * @returns {Promise<number>}
 */
async function getLastProcessedDate() {
  const result = await ddb()
    .getItem({
      TableName,
      Key: LAST_PROCESSED_DDB_KEY
    })
    .promise()
    .then(d => d.Item);

  return result
    ? Number.parseInt(result.lastProcessedDate.N)
    : 0;
}

/**
 * 更新 DynamoDB 的處理進度
 *
 * @param dateNumber
 * @returns {Promise<PromiseResult<DynamoDB.PutItemOutput, AWSError>>}
 */
async function setLastProcessedDate(dateNumber) {
  return ddb().putItem({
    TableName,
    Item: Object.assign({
      lastProcessedDate: { N: String(dateNumber) }
    }, LAST_PROCESSED_DDB_KEY)
  }).promise()
}

/**
 * 批次將資料寫入 DynamoDB
 *
 * @param dataset
 * @returns {Promise<void>}
 */
async function batchPutData(dataset) {
  const maxLength = 25;

  if (dataset.length === 0) {
    return
  }

  if (dataset.length > maxLength) {
    const half = Math.floor(dataset.length / 2);
    const someDataset = dataset.splice(half);
    await Promise.all([
      batchPutData(someDataset), batchPutData(dataset)
    ]);
    return
  }

  console.log(`Writing ${dataset.length} items to DDB`);

  const params = {RequestItems: {}};
  params.RequestItems[TableName] = dataset.map(record => ({
    PutRequest: {
      Item: {
        location: {S: record.locationName},
        date: {N: String(record.dateNumber)},
        rainFall: {N: record.rainFall}
      }
    }
  }));

  await ddb().batchWriteItem(params).promise()
}

/**
 * 將 record 轉換爲標準形式
 *
 * @param locationName
 * @param dateString
 * @param rainFall
 * @returns {{rainFall: string, locationName: string, dateNumber: number}}
 */
function constructRecord(locationName, dateString, rainFall) {

  if (Number.isNaN(Number(rainFall))) {
    rainFall = '-1'
  }

  return {
    locationName: locationName.split(',')[0],
    dateNumber: dateNumberFromString(dateString),
    rainFall
  }
}

/**
 * Lambda Handler
 *
 * @param event
 * @returns {Promise<void>}
 */
exports.handle = async function (event) {
  const rawData = await fetchRainFall();
  const lastProcessedDateNumber = await getLastProcessedDate();

  let latestDateNumberSeen = lastProcessedDateNumber;

  const newDataset = rawData
    .map(location => {
      const locationName = location.locationName;
      return location.weatherElement.time
        .map(line => constructRecord(locationName, line.dataTime, line.elementValue.value))
        .filter(record => record.dateNumber > lastProcessedDateNumber);
    })
    .reduce((l, r) => l.concat(r), []);

  newDataset.map(
    record => {
      latestDateNumberSeen = Math.max(latestDateNumberSeen, record.dateNumber)
    }
  );

  await batchPutData(newDataset);
  await setLastProcessedDate(latestDateNumberSeen);
};
