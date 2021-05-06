export default {
  schedule: {
    interval: '7h',
    type: 'worker',
  },
  async task(ctx) {
    const mysql = ctx.app.mysql;
    mysql.query('select 1');
  },
};
