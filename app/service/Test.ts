import { Service } from 'egg';
import { testPlatformData, testTitleData, testItemData, testDatabaseData } from './testData';
/**
 * Test Service
 */
export default class Test extends Service {
  async initTest() {
    try {
      testPlatformData.forEach(async platform => {
        await this.app.mysql.delete('Platform_Metric', {
          platform_id: platform.id,
        });
        await this.createAPlatform(platform);
      });

      testDatabaseData.forEach(async database => {
        await this.app.mysql.delete('Database_Metric', {
          database_id: database.id,
        });
        await this.createADatabase(database);
      });

      testTitleData.forEach(async title => {
        await this.app.mysql.delete('Title_Metric', {
          title_id: title.id,
        });
        await this.createAnEbook(title);
      });

      testItemData.forEach(async item => {
        await this.app.mysql.delete('Item_Metric', {
          item_id: item.id,
        });
        await this.createAChapter(item);
      });
    } catch (err) {
      throw new Error(err.sqlMessage);
    }
  }


  async clearTest() {
    try {
      testPlatformData.forEach(async platform => {
        await this.app.mysql.delete('Platform_Metric', {
          platform_id: platform.id,
        });
        await this.app.mysql.delete('Platform', {
          id: platform.id,
        });
      });

      testDatabaseData.forEach(async database => {
        await this.app.mysql.delete('Database_Metric', {
          database_id: database.id,
        });
        await this.app.mysql.delete('Database', {
          id: database.id,
        });
      });

      testTitleData.forEach(async title => {
        await this.app.mysql.delete('Title_Metric', {
          title_id: title.id,
        });
        await this.app.mysql.delete('Title', {
          id: title.id,
        });
      });

      testItemData.forEach(async item => {
        await this.app.mysql.delete('Item_Metric', {
          item_id: item.id,
        });
        await this.app.mysql.delete('Item', {
          id: item.id,
        });
      });
    } catch (err) {
      throw new Error(err.sqlMessage);
    }
  }

  async createAnEbook(data: any) {
    try {
      const query = `
        replace into Counter.Title(${Object.keys(data).join(',')}) values (${Object.values(data).map(str => `'${str}'`).join(',')})
      `;
      await this.app.mysql.query(query);
    } catch (err) {
      console.log(err);
      throw new Error(err.sqlMessage);
    }
  }

  async createAChapter(data: any) {
    try {
      const query = `
        replace into Counter.Item(${Object.keys(data).join(',')}) values (${Object.values(data).map(str => `'${str}'`).join(',')})
      `;
      await this.app.mysql.query(query);
    } catch (err) {
      console.log(err);
      throw new Error(err.sqlMessage);
    }
  }
  async createAPlatform(data: any) {
    try {
      const query = `
        replace into Counter.Platform(${Object.keys(data).join(',')}) values (${Object.values(data).map(str => `'${str}'`).join(',')})
      `;
      await this.app.mysql.query(query);
    } catch (err) {
      console.log(err);
      throw new Error(err.sqlMessage);
    }
  }

  async createADatabase(data: any) {
    try {
      const query = `
        replace into Counter.\`Database\`(${Object.keys(data).map(name => (name === 'database' ? '`database`' : name)).join(',')}) values (${Object.values(data).map(str => `'${str}'`).join(',')})
      `;
      await this.app.mysql.query(query);
    } catch (err) {
      console.log(err);
      throw new Error(err.sqlMessage);
    }
  }
}
