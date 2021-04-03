// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTest from '../../../app/service/Test';
import ExportGetRecord from '../../../app/service/getRecord';
import ExportTestData from '../../../app/service/testData';
import ExportUpload from '../../../app/service/upload';
import ExportUser = require('../../../app/service/user');

declare module 'egg' {
  interface IService {
    test: AutoInstanceType<typeof ExportTest>;
    getRecord: AutoInstanceType<typeof ExportGetRecord>;
    testData: AutoInstanceType<typeof ExportTestData>;
    upload: AutoInstanceType<typeof ExportUpload>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
