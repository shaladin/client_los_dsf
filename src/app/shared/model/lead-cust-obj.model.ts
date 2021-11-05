export class LeadCustObj {
    LeadCustId: number;
    LeadId: number;
    CustNo: string;
    CustName: string;
    MrCustTypeCode: string;
    MrCustModelCode: string;
    MrIdTypeCode: string;
    IdNo: string;
    IdExpiredDt: string;
    TaxIdNo: string;
    IsVip: boolean;
    RowVersion: string;
    constructor() { this.LeadCustId = 0, this.RowVersion = "" }
}
