export class ResListCustMainDataObj {
    ListAppCustObj : Array<ResAppCustForListCustMainDataObj>;

    constructor(){
        this.ListAppCustObj = new Array<ResAppCustForListCustMainDataObj>();
    }
}

export class ResAppCustForListCustMainDataObj {
    AppCustId : number;
    ApplicantNo : string;
    CustNo : string;
    CustName : string;
    MrCustTypeCode : string;
    MrCustModelCode : string;
    MrIdTypeCode : string;
    IdNo : string;
    TaxIdNo : string;
    IsCustomer : boolean;
    IsFamily : boolean;
    IsShareholder : boolean;
    IsActive : boolean;
    IsSigner : boolean;
    MrCustRelationshipCode : string;
    MrCustRelationshipDescr : string;
    MrCustModelDescr : string;
    IsOwner : boolean;
    SharePrcnt : number;
    MrJobPositionCode : string;
    MrJobPositionCodeDesc : string;

    constructor(){
        this.AppCustId = 0;
        this.ApplicantNo = "";
        this.CustNo = "";
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.MrCustModelCode = "";
        this.MrIdTypeCode = "";
        this.IdNo = "";
        this.TaxIdNo = "";
        this.IsCustomer = false;
        this.IsFamily = false;
        this.IsShareholder = false;
        this.IsActive = false;
        this.IsSigner = false;
        this.MrCustRelationshipCode = "";
        this.MrCustRelationshipDescr = "";
        this.MrCustModelDescr = "";
        this.IsOwner = false;
        this.SharePrcnt = 0;
        this.MrJobPositionCode = "";
        this.MrJobPositionCodeDesc = "";
    }
}