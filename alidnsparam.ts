export interface AliddnsParam{
    RecordId: number;
    RR: string;
    Type: string;
    Value: string;

// &RecordId=9999985
// &RR=www
// &Type=A
// &Value=202.106.0.20

}

export interface QueryParam extends AliddnsParam {
    accessKeyId: string;
    accessKeySecret: string;
}
