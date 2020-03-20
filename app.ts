import { createServer } from 'http';
import Core from '@alicloud/pop-core';
import { parse } from 'url';
import { parse as queryParse } from 'querystring';
import { QueryParam } from './alidnsparam';


var url = require("url");
var querystring = require("querystring");

const server = createServer((req, res) => {
    console.info(req.url);

    new Promise<QueryParam>((resolve, reject) => {
        try {
            var url = parse(req.url || '');
            var params = queryParse(url.query || 's=1');
            if (params && params.accessKeyId && params.accessKeySecret && params.RecordId && params.RR && params.Type && params.Value) {
                resolve({
                    accessKeyId: params.accessKeyId as string,
                    accessKeySecret: params.accessKeySecret as string,
                    RecordId: parseInt(params.RecordId as string),
                    RR: params.RR as string,
                    Type: params.Type as string,
                    Value: params.Value as string,
                } as QueryParam);
            } else {
                reject(new Error('参数有误'));
            }
        } catch (error) {
            reject(error);
        }

    }).then(result => {
        return new Core({
            accessKeyId: result.accessKeyId,
            accessKeySecret: result.accessKeySecret,
            endpoint: 'https://alidns.aliyuncs.com',
            apiVersion: '2015-01-09'
        }).request('UpdateDomainRecord', result, {
            method: 'POST'
        })
    }).then(result => {
        console.log(result);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    }).catch(err => {
        console.error(err);

        res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(false));

    });

}).listen(5080, () => {
    console.info("server start on 127.0.0.1:5080");
})