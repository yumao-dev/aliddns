import { createServer } from "http";
import { parse as queryParse } from "querystring";
import { parse } from "url";
import { LogHelper } from "yanyu-helper";
import { DDNS } from "./ddns";
import { QueryParam } from "./interface/settings";
const log = LogHelper.create();

var server = createServer((req, res) => {
  let reqaddress: string | undefined;
  new Promise<QueryParam>((resolve, reject) => {
    try {
      reqaddress =
        (typeof req.headers["x-real-ip"] === "string"
          ? (req.headers["x-real-ip"] as string)
          : undefined) || req.socket.remoteAddress;
      let url = parse(req.url || "");
      let params = queryParse(url.query || "");

      //参数格式化小写
      let obj: { [key: string]: string | undefined } = {};
      for (const key in params) {
        if (params[key]) {
          obj[key.toLowerCase()] =
            typeof params[key] === "string"
              ? (params[key] as string)
              : undefined;
        }
      }

      resolve({
        apiKey: obj.apikey,
        apiSecret: obj.apisecret,
        domainName: obj.domainname,
        ip: obj.ip || reqaddress,
      } as QueryParam);
    } catch (error) {
      reject(error);
    }
  })
    .then((result) => {
      return new DDNS(reqaddress).update(result);
    })
    .then((result) => {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(result));
    })
    .catch((err: Error) => {
      // if (err.message != '参数有误') {
      log.write(err, "Error", "更改DNS解析记录", reqaddress);
      // }
      res.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(err.message));
    });
}).listen(process.env.PORT || 3000, () => {
  let addr = server.address();
  let bind = addr
    ? typeof addr === "string"
      ? addr
      : `port:${addr.port}`
    : "UnKnow";
  console.log(`server start on ${bind}`);
});
