import { Controller } from 'egg';

export default class GetRecordController extends Controller {
  async index() {
    const { ctx } = this;

    const table = ctx.request.body.table;
    const condition = ctx.request.body.condition;
    try {
      const result = await ctx.service.getRecord.index(table, condition);
      ctx.body = {
        code: 200,
        message: 'Get record successfullly!',
        data: result,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        message: err.message,
      };
    }
  }
}
