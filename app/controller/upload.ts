import { Controller } from 'egg';

export default class UploadController extends Controller {
  async index() {
    const { ctx } = this;

    try {
      await ctx.service.upload.index(ctx.request.body);
      ctx.body = {
        code: 200,
        message: 'Collect data successfullly!',
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        message: err.message,
      };
    }
  }
}
