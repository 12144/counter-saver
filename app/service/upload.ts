import { Service } from 'egg';

interface UploadData {
  user_id: string;
  item_id: string;
  parent_id: string;
  requests: number;
  investigations: number;
  no_license: number;
  limit_exceeded: number;
}

enum MetricTypeTable {
  UNIQUE_ITEM_REQUESTS = 'Unique_Item_Requests',
  UNIQUE_ITEM_INVESTIGATIONS = 'Unique_Item_Investigations',
  UNIQUE_TITLE_REQUESTS = 'Unique_Title_Requests',
  UNIQUE_TITLE_INVESTIGATIONS = 'Unique_Title_Investigations'
}

// interface TitleValue {
//   title: string;
//   doi: string;
//   id: string;
//   isbn: string;
//   print_issn: string;
//   online_issn: string;
//   linking_issn: string;
//   uri: string;
//   platform: string;
//   publisher: string;
//   publisher_id: string;
//   yop: number;
//   access_type: string;
// }

// interface ItemValue {
//   item: string;
//   publisher: string;
//   publisher_id: string;
//   platform: string;
//   authors: string;
//   publication_date: string;
//   article_version: string;
//   doi: string;
//   id: string;
//   isbn: string;
//   print_issn: string;
//   online_issn: string;
//   uri: string;
//   data_type: string;
//   yop: number;
//   access_type: string;
//   access_method: string;
//   parent_id: string;
// }

interface TitleMetricValue {
  title_id: string;
  month: string,
  unique_title_investigations: number;
  unique_title_requests: number;
  total_item_investigations: number;
  unique_item_investigations: number;
  total_item_requests: number;
  unique_item_requests: number;
  no_license: number;
  limit_exceeded: number;
}

interface ItemMetricValue {
  item_id: string,
  month: string,
  total_item_investigations: number;
  unique_item_investigations: number;
  total_item_requests: number;
  unique_item_requests: number;
  no_license: number;
  limit_exceeded: number;
}

function initItem(item_id:string, month:string) {
  return {
    item_id,
    month,
    total_item_investigations: 0,
    unique_item_investigations: 0,
    total_item_requests: 0,
    unique_item_requests: 0,
    no_license: 0,
    limit_exceeded: 0,
  };
}

function initTitle(title_id: string, month: string) {
  return {
    title_id,
    month,
    total_item_investigations: 0,
    total_item_requests: 0,
    unique_item_investigations: 0,
    unique_item_requests: 0,
    unique_title_investigations: 0,
    unique_title_requests: 0,
    no_license: 0,
    limit_exceeded: 0,
  };
}
/**
 * Test Service
 */
export default class Upload extends Service {
  /**
    * 对于Unique_Item和Unique_Title类的指标要判断用户是否已经执行过这个操作，如果已经执行过则需要忽略
    * 对于Total_Item指标累加count的值即可
    */
  async index(dataList: UploadData[]) {
    const mysql = this.app.mysql;
    const now = new Date();
    const month = `${now.getFullYear()}-${now.getMonth() + 1}-01`;

    for (let i = 0; i < dataList.length; i++) {
      let itemExist = true,
        titleExist = true;
      const data = dataList[i];
      // 不需要检查user, item, title是否存在，因为有外键约束，如果不存在插入记录时会报错
      let itemMetricRecord = await mysql.get('Item_Metric', { item_id: data.item_id, month });
      if (!itemMetricRecord) {
        itemMetricRecord = initItem(data.item_id, month);
        itemExist = false;
      }

      let titleMetricRecord = await mysql.get('Title_Metric', { title_id: data.parent_id, month });
      if (!titleMetricRecord) {
        titleMetricRecord = initTitle(data.parent_id, month);
        titleExist = false;
      }

      console.log('data', data);

      this.dealNoLicense(itemMetricRecord, titleMetricRecord, data);
      this.dealLimitExceeded(itemMetricRecord, titleMetricRecord, data);
      await this.dealInvestigations(itemMetricRecord, titleMetricRecord, data);
      await this.dealRequests(itemMetricRecord, titleMetricRecord, data);

      if (itemExist) {
        mysql.update('Item_Metric', itemMetricRecord, {
          where: { item_id: itemMetricRecord.item_id, month },
        });
      } else {
        mysql.insert('Item_Metric', itemMetricRecord);
      }

      if (titleExist) {
        mysql.update('Title_Metric', titleMetricRecord, {
          where: { title_id: titleMetricRecord.title_id, month },
        });
      } else {
        mysql.insert('Title_Metric', titleMetricRecord);
      }
    }
  }

  dealNoLicense(itemRecord: ItemMetricValue, titleRecord: TitleMetricValue, data: UploadData): void {
    itemRecord.no_license += data.no_license;
    titleRecord.no_license += data.no_license;
  }

  dealLimitExceeded(itemRecord: ItemMetricValue, titleRecord: TitleMetricValue, data: UploadData): void {
    itemRecord.limit_exceeded += data.limit_exceeded;
    titleRecord.limit_exceeded += data.limit_exceeded;
  }

  async dealInvestigations(itemRecord: ItemMetricValue, titleRecord: TitleMetricValue, data: UploadData) {
    if (!data.investigations) return;
    itemRecord.total_item_investigations += data.investigations;
    titleRecord.total_item_investigations += data.investigations;
    if (await this.insert(data.user_id, data.item_id, MetricTypeTable.UNIQUE_ITEM_INVESTIGATIONS)) {
      itemRecord.unique_item_investigations++;
      titleRecord.unique_item_investigations++;
    }
    if (await this.insert(data.user_id, data.parent_id, MetricTypeTable.UNIQUE_TITLE_INVESTIGATIONS)) {
      titleRecord.unique_title_investigations++;
    }
  }

  async dealRequests(itemRecord: ItemMetricValue, titleRecord: TitleMetricValue, data: UploadData) {
    if (!data.requests) return;
    itemRecord.total_item_requests += data.requests;
    titleRecord.total_item_requests += data.requests;
    if (await this.insert(data.user_id, data.item_id, MetricTypeTable.UNIQUE_ITEM_REQUESTS)) {
      itemRecord.unique_item_requests++;
      titleRecord.unique_item_requests++;
    }
    if (await this.insert(data.user_id, data.parent_id, MetricTypeTable.UNIQUE_TITLE_REQUESTS)) {
      titleRecord.unique_title_requests++;
    }
  }

  /**
   * 唯一类指标插入一条记录
   * @param user_id 用户标识
   * @param item_id 项标识
   * @param table 表名
   * @return {boolean} true插入成功，false已存在数据不插入
   */
  async insert(user_id: string, item_id: string, table: MetricTypeTable) {
    let value;
    const mysql = this.app.mysql;

    if (table === MetricTypeTable.UNIQUE_ITEM_INVESTIGATIONS
      || table === MetricTypeTable.UNIQUE_ITEM_REQUESTS) {
      value = { user_id, item_id };
    } else {
      value = { user_id, title_id: item_id };
    }

    const record = await mysql.get(table, value);
    if (record) {
      return false;
    }

    await mysql.insert(table, value);
    return true;
  }
}
