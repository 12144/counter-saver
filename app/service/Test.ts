import { Service } from 'egg';

/**
 * Test Service
 */
export default class Test extends Service {
  async createAnEbook(data: any) {
    try {
      await this.app.mysql.insert('Title', data);
    } catch (err) {
      throw new Error(err.sqlMessage);
    }
  }

  async createAChapter(data: any) {
    try {
      await this.app.mysql.insert('Item', data);
    } catch (err) {
      console.log(err);
      throw new Error(err.sqlMessage);
    }
  }
  async createAPlatform(data: any) {
    try {
      await this.app.mysql.insert('Platform', data);
    } catch (err) {
      console.log(err);
      throw new Error(err.sqlMessage);
    }
  }
}
