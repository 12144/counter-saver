// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGetRecord from '../../../app/controller/getRecord';
import ExportTest from '../../../app/controller/test';
import ExportUpload from '../../../app/controller/upload';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    getRecord: ExportGetRecord;
    test: ExportTest;
    upload: ExportUpload;
    user: ExportUser;
  }
}
