import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/initTest', controller.test.initTest);
  router.get('/clearTest', controller.test.clearTest);
  router.post('/getRecord', controller.getRecord.index);
  router.post('/upload', controller.upload.index);
  router.post('/create/title', controller.test.createTitle);
  router.post('/create/item', controller.test.createItem);
  router.post('/create/platform', controller.test.createPlatform);
  router.get('/getUserIP', controller.user.getUserRealIP);
};
