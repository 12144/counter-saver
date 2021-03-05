// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/controller/test';
import ExportUpload from '../../../app/controller/upload';

declare module 'egg' {
  interface IController {
    test: ExportTest;
    upload: ExportUpload;
  }
}
