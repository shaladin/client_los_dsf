export class ReqGetCustDupCheckObj {
    CustName: string;
    MrCustTypeCode: string;
    MrCustModelCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    TaxIdNo: string;
    BirthDt: Date;
    MobilePhnNo1: string;
    RowVersion: string;

    constructor() {
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.MrCustModelCode = "";
        this.MrIdTypeCode = "";
        this.IdNo = "";
        this.TaxIdNo = "";
        this.BirthDt = new Date();
        this.MobilePhnNo1 = "";
        this.RowVersion = "";
    }
}
export class ReqGetAppCustDupCheckObj extends ReqGetCustDupCheckObj{
    AppId: number;
    MotherMaidenName: string;

    constructor() {
        super();
        this.AppId = 0;
        this.MotherMaidenName = "";
    }
}