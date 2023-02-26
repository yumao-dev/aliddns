import Core from "@alicloud/pop-core";
import { Address4, Address6 } from "ip-address";
import { LogHelper, Logtype } from "yanyu-helper";
import { AliyunResponse, DescribeDomainRecordsRsp, QueryParam } from "./interface";
import { Validate } from "./validate";

const log = LogHelper.create(Logtype.http);

export class DDNS {
  constructor(private reqip: string | undefined) {}

  public async update(param: QueryParam) {
    //判断参数（存在以及各式）;

    let valid = await new Validate().validate(param);

    //更新域名记录
    if (Address4.isValid(param.ip)) {
      return await this.updatev4(param);
    } else if (Address6.isValid(param.ip)) {
      return await this.updatev6(param);
    } else {
      throw new Error("只支持v4或者v6");
    }
  }

  private async updatev4(param: QueryParam) {
    let domain = await new Validate().formatDomain(param.domainName);
    const RRID = await this.DescribeDomainRecords(param.apiKey, param.apiSecret, domain.domain, domain.RR);
    let result = true;
    if (RRID.v4) {
      //有v4的解析记录存在
      if (RRID.v4.value === param.ip) {
        log.write(`域名:${param.domainName},IPv4地址为：${param.ip}`, "INFO", "不需要修改解析记录", this.reqip);
      } else {
        result = await this.UpdateDomainRecord(param.apiKey, param.apiSecret, RRID.v4.rid, domain.RR, "A", param.ip);

        log.write(
          `域名:${param.domainName},IPv4地址为：${param.ip},結果:${result}`,
          "Warring",
          "修改解析记录",
          this.reqip
        );
      }
    } else {
      //没有v4的解析记录存在
      result = await this.AddDomainRecord(param.apiKey, param.apiSecret, domain.domain, domain.RR, "A", param.ip);

      log.write(
        `域名:${param.domainName},IPv4地址为：${param.ip},結果:${result}`,
        "Warring",
        "添加解析记录",
        this.reqip
      );
    }
    return result;
  }

  private async updatev6(param: QueryParam) {
    let domain = await new Validate().formatDomain(param.domainName);
    const RRID = await this.DescribeDomainRecords(param.apiKey, param.apiSecret, domain.domain, domain.RR);
    let result = true;
    if (RRID.v6) {
      if (RRID.v6.value === param.ip) {
        log.write(`域名:${param.domainName},IPv6地址为：${param.ip}`, "INFO", "不需要修改解析记录", this.reqip);
      } else {
        result = await this.UpdateDomainRecord(param.apiKey, param.apiSecret, RRID.v6.rid, domain.RR, "AAAA", param.ip);

        log.write(
          `域名:${param.domainName},IPv6地址为：${param.ip},結果:${result}`,
          "Warring",
          "修改解析记录",
          this.reqip
        );
      }
    } else {
      //没有v4的解析记录存在
      result = await this.AddDomainRecord(param.apiKey, param.apiSecret, domain.domain, domain.RR, "AAAA", param.ip);
      log.write(
        `域名:${param.domainName},IPv6地址为：${param.ip},結果:${result}`,
        "Warring",
        "添加解析记录",
        this.reqip
      );
    }
    return result;
  }

  private async DescribeDomainRecords(
    apiKey: string,
    apiSecret: string,
    domainName: string,
    RR: string
  ): Promise<DescribeDomainRecordsRsp> {
    const result: AliyunResponse.DNS.DescribeDomainRecords = await new Core({
      accessKeyId: apiKey,
      accessKeySecret: apiSecret,
      endpoint: "https://alidns.aliyuncs.com",
      apiVersion: "2015-01-09",
    }).request("DescribeDomainRecords", { DomainName: domainName }, { method: "POST" });

    const RRExists4 = result.DomainRecords.Record.findIndex((v) => {
      if (v.RR === RR && v.Type === "A") return true;
      return false;
    });

    const RRExists6 = result.DomainRecords.Record.findIndex((v) => {
      if (v.RR === RR && v.Type === "AAAA") return true;
      return false;
    });

    return {
      v4:
        RRExists4 < 0
          ? false
          : {
              rid: result.DomainRecords.Record[RRExists4].RecordId,
              value: result.DomainRecords.Record[RRExists4].Value,
            },
      v6:
        RRExists6 < 0
          ? false
          : {
              rid: result.DomainRecords.Record[RRExists6].RecordId,
              value: result.DomainRecords.Record[RRExists6].Value,
            },
    };
  }

  private async AddDomainRecord(
    apiKey: string,
    apiSecret: string,
    DomainName: string,
    RR: string,
    Type: "A" | "AAAA",
    Value: string,
    TTL: number = 600
  ) {
    try {
      const result: AliyunResponse.DNS.AddDomainRecord = await new Core({
        accessKeyId: apiKey,
        accessKeySecret: apiSecret,
        endpoint: "https://alidns.aliyuncs.com",
        apiVersion: "2015-01-09",
      }).request("AddDomainRecord", { DomainName, RR, Type, Value, TTL }, { method: "POST" });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  private async UpdateDomainRecord(
    apiKey: string,
    apiSecret: string,
    RecordId: string,
    RR: string,
    Type: "A" | "AAAA",
    Value: string,
    TTL: number = 600
  ) {
    try {
      const result: AliyunResponse.DNS.UpdateDomainRecord = await new Core({
        accessKeyId: apiKey,
        accessKeySecret: apiSecret,
        endpoint: "https://alidns.aliyuncs.com",
        apiVersion: "2015-01-09",
      }).request("UpdateDomainRecord", { RecordId, RR, Type, Value, TTL }, { method: "POST" });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
