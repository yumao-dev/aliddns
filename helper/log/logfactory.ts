import { Log, Logtype } from "./ilog";
import { LogHelper } from "./loghelper";

export { Logtype } from "./ilog";
export class LogFactory {
    private static _httplog: Log;

    static create(type: Logtype): Log {
        switch (type) {
            case Logtype.http: {
                if (!LogFactory._httplog) {
                    LogFactory._httplog = new LogHelper();
                }
                return LogFactory._httplog;
            }

            default:
                throw Error(`not support this ${type}`);
        }
    }
}