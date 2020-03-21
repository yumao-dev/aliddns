export interface AliddnsParam {
    RecordId: string;
    RR: string;
    Type: 'A' | 'AAAA';
    Value: string;
    accessKeyId: string;
    accessKeySecret: string;
}

export interface QueryParam {
    apiKey: string;
    apiSecret: string;
    domainName: string;
    type: 'A' | 'AAAA';
    ip: string;
}

export interface DescribeDomainRecordsRsp {
    v4: false | { rid: string, value: string };
    v6: false | { rid: string, value: string };
}