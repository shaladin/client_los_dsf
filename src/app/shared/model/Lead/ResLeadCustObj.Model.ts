export class ResLeadCustObj{ 
    LeadCustId : number;
    LeadId : number;
    CustNo : string;
    CustName : string;
    MrCustTypeCode : string;
    MrCustModelCode : string;
    MrIdTypeCode : string;
    IdNo : string;
    IdExpiredDt : Date;
    TaxIdNo : string;
    IsVip : boolean;
    RowVersion : string;
    
    constructor() {
        this.RowVersion = ""; 
    }
}
