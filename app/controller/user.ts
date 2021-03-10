import { Controller } from 'egg';

export default class UserController extends Controller {
  async getUserRealIP() {
    const { ctx } = this;
    const ip = ctx.ips[0];

    ctx.body = {
      code: 200,
      message: 'ok!',
      data: ip,
    };
  }
}
