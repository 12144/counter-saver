import { Service } from 'egg';

export default class GetRecord extends Service {
  public async index(table: string, condition:any) {
    const mysql = this.app.mysql;
    return mysql.get(table, condition);
  }
}
