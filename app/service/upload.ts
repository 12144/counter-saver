import { Service } from 'egg';

interface UploadData {
  item_id?: string,
  title_id?: string;
  platform_id?: string;
  database_id?: string;
  unique_item_requests: number;
  total_item_requests: number;
  unique_item_investigations: number;
  total_item_investigations: number;
  no_license: number;
  limit_exceeded: number;
  unique_title_requests?: number;
  unique_title_investigations?: number;
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

// interface TitleMetricValue {
//   title_id: string;
//   month: string,
//   unique_title_investigations: number;
//   unique_title_requests: number;
//   total_item_investigations: number;
//   unique_item_investigations: number;
//   total_item_requests: number;
//   unique_item_requests: number;
//   no_license: number;
//   limit_exceeded: number;
// }

// interface ItemMetricValue {
//   item_id: string,
//   month: string,
//   total_item_investigations: number;
//   unique_item_investigations: number;
//   total_item_requests: number;
//   unique_item_requests: number;
//   no_license: number;
//   limit_exceeded: number;
// }

function initItem(item_id:string, month:string) {
  return {
    item_id,
    month,
    access_method: 'Regular',
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
    access_method: 'Regular',
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

function initPlatform(platform_id: string, month: string) {
  return {
    platform_id,
    month,
    access_method: 'Regular',
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

function initDatabase(database_id: string, month: string) {
  return {
    database_id,
    month,
    access_method: 'Regular',
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
  async index(dataList: UploadData[]) {
    const now = new Date();
    const month = `${now.getFullYear()}-${now.getMonth() + 1}-01`;
    // to-do 判断access_method是不是TDM
    const access_method = 'Regular';

    for (let i = 0; i < dataList.length; i++) {
      const data = dataList[i];
      // 不需要检查user, item, title是否存在，因为有外键约束，如果不存在插入记录时会报错
      if (data.item_id) {
        this.dealItemMetric(data, month, access_method);
      } else if (data.title_id) {
        this.dealTitleMetric(data, month, access_method);
      } else if (data.database_id) {
        this.dealDatabaseMetric(data, month, access_method);
      } else {
        this.dealPlatformMetric(data, month, access_method);
      }
    }
  }

  async dealItemMetric(data: UploadData, month: string, access_method: string): Promise<void> {
    const mysql = this.app.mysql;
    let itemExist = true;

    let itemMetricRecord = await mysql.get('Item_Metric', { item_id: data.item_id, month, access_method });
    if (!itemMetricRecord) {
      itemMetricRecord = initItem(data.item_id!, month);
      itemExist = false;
    }

    itemMetricRecord.total_item_requests += data.total_item_requests;
    itemMetricRecord.total_item_investigations += data.total_item_investigations;
    itemMetricRecord.unique_item_requests += data.unique_item_requests;
    itemMetricRecord.unique_item_investigations += data.unique_item_investigations;
    itemMetricRecord.no_license += data.no_license;
    itemMetricRecord.limit_exceeded += data.limit_exceeded;

    if (itemExist) {
      mysql.update('Item_Metric', itemMetricRecord, {
        where: { item_id: itemMetricRecord.item_id, month, access_method },
      });
    } else {
      mysql.insert('Item_Metric', itemMetricRecord);
    }
  }

  async dealTitleMetric(data: UploadData, month: string, access_method: string):Promise<void> {
    const mysql = this.app.mysql;
    let titleExist = true;

    let titleMetricRecord = await mysql.get('Title_Metric', { title_id: data.title_id, month, access_method });
    if (!titleMetricRecord) {
      titleMetricRecord = initTitle(data.title_id!, month);
      titleExist = false;
    }

    titleMetricRecord.total_item_requests += data.total_item_requests;
    titleMetricRecord.total_item_investigations += data.total_item_investigations;
    titleMetricRecord.unique_item_requests += data.unique_item_requests;
    titleMetricRecord.unique_item_investigations += data.unique_item_investigations;
    titleMetricRecord.unique_title_requests += data.unique_title_requests!;
    titleMetricRecord.unique_title_investigations += data.unique_title_investigations!;
    titleMetricRecord.no_license += data.no_license;
    titleMetricRecord.limit_exceeded += data.limit_exceeded;

    if (titleExist) {
      mysql.update('Title_Metric', titleMetricRecord, {
        where: { title_id: titleMetricRecord.title_id, month, access_method },
      });
    } else {
      mysql.insert('Title_Metric', titleMetricRecord);
    }
  }

  async dealPlatformMetric(data: UploadData, month: string, access_method: string):Promise<void> {
    const mysql = this.app.mysql;
    let platformExist = true;

    let platformMetricRecord = await mysql.get('Platform_Metric', { platform_id: data.platform_id, month, access_method });

    if (!platformMetricRecord) {
      platformMetricRecord = initPlatform(data.platform_id!, month);
      platformExist = false;
    }

    platformMetricRecord.total_item_requests += data.total_item_requests;
    platformMetricRecord.total_item_investigations += data.total_item_investigations;
    platformMetricRecord.unique_item_requests += data.unique_item_requests;
    platformMetricRecord.unique_item_investigations += data.unique_item_investigations;
    platformMetricRecord.unique_title_requests += data.unique_title_requests!;
    platformMetricRecord.unique_title_investigations += data.unique_title_investigations!;
    platformMetricRecord.no_license += data.no_license;
    platformMetricRecord.limit_exceeded += data.limit_exceeded;

    if (platformExist) {
      mysql.update('Platform_Metric', platformMetricRecord, {
        where: { platform_id: platformMetricRecord.platform_id, month, access_method },
      });
    } else {
      mysql.insert('Platform_Metric', platformMetricRecord);
    }
  }

  async dealDatabaseMetric(data: UploadData, month: string, access_method: string):Promise<void> {
    const mysql = this.app.mysql;
    let databaseExist = true;

    let databaseMetricRecord = await mysql.get('Database_Metric', { database_id: data.database_id, month, access_method });

    if (!databaseMetricRecord) {
      databaseMetricRecord = initDatabase(data.database_id!, month);
      databaseExist = false;
    }

    databaseMetricRecord.total_item_requests += data.total_item_requests;
    databaseMetricRecord.total_item_investigations += data.total_item_investigations;
    databaseMetricRecord.unique_item_requests += data.unique_item_requests;
    databaseMetricRecord.unique_item_investigations += data.unique_item_investigations;
    databaseMetricRecord.unique_title_requests += data.unique_title_requests!;
    databaseMetricRecord.unique_title_investigations += data.unique_title_investigations!;
    databaseMetricRecord.no_license += data.no_license;
    databaseMetricRecord.limit_exceeded += data.limit_exceeded;

    if (databaseExist) {
      mysql.update('Database_Metric', databaseMetricRecord, {
        where: { database_id: databaseMetricRecord.database_id, month, access_method },
      });
    } else {
      mysql.insert('Database_Metric', databaseMetricRecord);
    }
  }
}
