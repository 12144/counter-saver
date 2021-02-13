import 'egg';

declare module 'egg' {
    // egg-mysql 没有为ts写声明，因此在 Application 中是没有 mysql 的声明的，补充声明
    interface Application {
        mysql: any;
    }
}