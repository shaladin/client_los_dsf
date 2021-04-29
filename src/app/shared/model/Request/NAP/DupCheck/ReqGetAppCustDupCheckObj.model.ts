export class ReqGetAppCustDupCheckObj {
    CustName: string;
    MrCustTypeCode: string;
    MrCustModelCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    TaxIdNo: string;
    BirthDt: Date;
    MotherMaidenName: string;
    MobilePhnNo1: string;
    AppId: number;
    RowVersion: string;

    constructor() {
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.MrCustModelCode = "";
        this.MrIdTypeCode = "";
        this.IdNo = "";
        this.TaxIdNo = "";
        this.BirthDt = new Date();
        this.MotherMaidenName = "";
        this.MobilePhnNo1 = "";
        this.AppId = 0;
        this.RowVersion = "";
    }
}