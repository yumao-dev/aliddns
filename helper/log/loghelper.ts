import * as http from "http";
import { Log } from "./ilog";


export class LogHelper extends Log {

    public write(msg: string | Error, level: "Trace" | "INFO" | "Error" | "Warring", title?: string, clientip?: string): Promise<void> {
        return Promise.resolve().then(() => {
            if (msg) {
                let entity: IRemoteLogEntity = <IRemoteLogEntity>{
                    title: title ? title : msg instanceof Error ? msg.message : 'title',
                    message: msg instanceof Error ? msg.stack || msg.message : msg,
                    app: this.appname,
                    logtype: level,
                    time: new Date().getTime(),
                    clientip: clientip,
                    serverip: this.IP,
                };
                if (process.env.NODE_ENV === 'debug') {
                    console.log(msg);
                } else {
                    this.HttpLog(entity).then(result => {
                        if (result && result.error)
                            console.log(result.error);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }

        })
    }

    private HttpLog(Data: IRemoteLogEntity): Promise<ResultEntity> {
        return new Promise<ResultEntity>((resolve, reject) => {
            let req = http.request({
                host: "log.yumao.tech",
                path: `/`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charst=utf-8',
                    // 如果代理服务器需要认证
                    //'Proxy-Authentication': 'Base ' + new Buffer('user:password').toString('base64')    // 替换为代理服务器用户名和密码
                    //'Content-Length': Buffer.byteLength(postData)
                }
            }, (response => {
                // response.setEncoding('utf8');
                let resData: Buffer = Buffer.from('');
                response.on("data", (data: Buffer) => {
                    //type BufferEncoding = "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex";
                    resData = Buffer.concat([resData, data]);
                }).on("end", () => {
                    try {
                        if (response.statusCode != 200) {
                            reject(new Error(`code:${response.statusMessage},err:${resData}`));
                        } else {
                            let r = JSON.parse(resData.toString('utf-8'));
                            resolve(r);
                        }
                    } catch (error) {
                        reject(resData);
                    }
                }).on("error", (err) => {
                    reject(err);
                });
            })).on("error", err => {
                reject(err)
            }).end(JSON.stringify(Data), 'utf8');

        })


    }


}

interface ResultEntity {
    result: boolean;
    error: string;
}
// export interface logtype {
//     Trace: 'Trace';
//     INFO: 'INFO';
//     Error: 'Error';
//     Warring: 'Warring';
// }
//日志记录格式
interface IRemoteLogEntity {
    title: string;
    message: string;
    time: number;
    app: string;
    logtype: "Trace" | "INFO" | "Error" | "Warring";
    clientip?: string;
    serverip?: string;
}