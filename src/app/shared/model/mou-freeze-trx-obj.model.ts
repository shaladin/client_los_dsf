export class MouFreezeTrxObj {
    MouFreezeTrxId: number;
    MouFreezeTrxNo: string;
    MouCustId: number;
    IsFreeze: boolean;
    Status: string;
    FreezeSrc: string;
    ReqByRefUserCode: String;
    RefReasonCode: String;
    ExeDt: Date;
    ApvDt: Date;
    ReqDt: Date;
    Notes: string;
    constructor() {
        this.MouFreezeTrxId = 0;
        this.MouFreezeTrxNo = "";
        this.MouCustId = 0;
        this.IsFreeze = false;
        this.Status = "";
        this.FreezeSrc = "";
        this.ReqByRefUserCode = "";
        this.RefReasonCode = "";
        this.ExeDt = new Date();
        this.ApvDt = new Date();
        this.Notes = "";
        this.ReqDt = new Date();
    }
}