export class ReqGetMouCustDuplicateObj {
    CustName: string;
    MrCustTypeCode: string;
    MrCustModelCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    TaxIdNo: string;
    BirthDt: Date;
    MobilePhnNo1: string;
    RowVersion: string;
}

export class ReqMouCustDuplicateObj extends ReqGetMouCustDuplicateObj {
    MotherMaidenName:string;
    MouCustId: number;

    constructor() {
        super();
        this.MotherMaidenName = "";
        this.MouCustId = 0;
    }
}