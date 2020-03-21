const packageconfig = require("../../package.json");
import { networkInterfaces } from 'os';

interface ILog {
   write(msg: string | Error, level: "Trace" | "INFO" | "Error" | "Warring", title?: string, clientip?: string): Promise<void>;
}

export enum Logtype {
   http,
   // redis
}

export abstract class Log implements ILog { // 抽象产品 - 枪
   abstract write(msg: string | Error, level: "Trace" | "INFO" | "Error" | "Warring", title?: string, clientip?: string): Promise<void>;
   get appname(): string {
      return packageconfig.name
   }
   get IP(): string {
      let interfaces = networkInterfaces();
      let IP = 'unknow';
      for (const key in interfaces) {
         const element = interfaces[key];
         const first = element.find(item => item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal);
         if (first) {
            IP = first.address;
            break;
         }
         continue;
      }
      return IP;
   }
}
