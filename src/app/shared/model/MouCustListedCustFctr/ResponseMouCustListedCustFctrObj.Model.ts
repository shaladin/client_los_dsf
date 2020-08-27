export class ResponseMouCustListedCustFctrObj {
    MouListedCustFctrId: number;
    MouCustId: number;
    CustNo: string;
    CustName: string;
    MrCustTypeCode: string;
    MrCustTypeDescr: string;    
    RowVersion: string;
    constructor() {
        this.MouListedCustFctrId = 0;
        this.MouCustId = 0;
        this.CustNo = "";
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.MrCustTypeDescr = "";   
        this.RowVersion= "";
    }
}
