export class ResListAppDupCheckCustMainDataObj {
    ListDuplicateAppCust : Array<ResAppDupCheckCustMainDataObj>;
    
    constructor(){
        this.ListDuplicateAppCust = new Array<ResAppDupCheckCustMainDataObj>();
    }
}

export class ResAppDupCheckCustMainDataObj {
    AppCustId: number;
    ApplicantNo : string;
    CustName : string;
    MrIdType : string;
    IdNo : string;
    BirthDt : Date;
    MotherMaidenName : string;
    TaxIdNo : string;
    MobilePhnNo1 : string;
    DuplicateItem : string;
    
    constructor(){
        this.AppCustId = 0;
        this.ApplicantNo = "";
        this.CustName = "";
        this.MrIdType = "";
        this.IdNo = "";
        this.BirthDt = new Date();
        this.MotherMaidenName = "";
        this.TaxIdNo = "";
        this.MobilePhnNo1 = "";
        this.DuplicateItem = "";
    }
}