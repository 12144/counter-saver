import { Controller } from 'egg';

export default class StatusController extends Controller {
    async index() {
        const { ctx } = this;
        ctx.body = await ctx.service.test.status();
    }
}