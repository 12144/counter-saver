import { Controller } from 'egg';

export default class TestController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = 'hi, eggg';
  }
  public async createTitle() {
    const { ctx } = this;
    try {
      await ctx.service.test.createAnEbook(ctx.request.body);
      ctx.body = {
        code: 200,
        message: 'create successfully!',
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        message: err.message,
      };
    }
  }

  public async createItem() {
    const { ctx } = this;
    try {
      await ctx.service.test.createAChapter(ctx.request.body);
      ctx.body = {
        code: 200,
        message: 'create successfully!',
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        message: err.message,
      };
    }
  }

  public async createPlatform() {
    const { ctx } = this;
    try {
      await ctx.service.test.createAPlatform(ctx.request.body);
      ctx.body = {
        code: 200,
        message: 'create successfully!',
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        message: err.message,
      };
    }
  }
}
