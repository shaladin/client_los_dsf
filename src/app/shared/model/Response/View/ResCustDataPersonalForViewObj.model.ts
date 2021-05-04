import { ResAppCustBankAccForViewObj } from "./ResAppCustBankAccForViewObj.model";

export class ResCustDataPersonalForViewObj {
    IsFamily : boolean;
    IsGuarantor : boolean;
    IsShareholder : boolean;
    MrCustModelCode : string;
    ListAppCustAddrObj : Array<ResAppCustAddrForViewObj>;
    ListAppCustBankAccObj : Array<ResAppCustBankAccForViewObj>;
    ListAppCustGrpObj : Array<ResAppCustGrpForViewObj>;
    ListAppCustFamilyObj : Array<ResAppCustCompletionObj>;

    constructor(){
        this.IsFamily = false;
        this.IsGuarantor = false;
        this.IsShareholder = false;
        this.MrCustModelCode = "";
        this.ListAppCustAddrObj = new Array<ResAppCustAddrForViewObj>();
        this.ListAppCustBankAccObj = new Array<ResAppCustBankAccForViewObj>();
        this.ListAppCustGrpObj = new Array<ResAppCustGrpForViewObj>();
        this.ListAppCustFamilyObj = new Array<ResAppCustCompletionObj>();
    }
}

export class ResAppCustAddrForViewObj {
    CustAddrTypeName : string;
    FullAddr : string;
    HouseOwnershipName : string;
    PhoneNo : string;
    PhoneNo2 : string;

    constructor(){
        this.CustAddrTypeName = "";
        this.FullAddr = "";
        this.HouseOwnershipName = "";
        this.PhoneNo = "";
        this.PhoneNo2 = "";
    }
}

export class ResAppCustGrpForViewObj {
    CustName : boolean;

    constructor(){
        this.CustName = false;
    }
}

export class ResAppCustCompletionObj {
    AppCustId : number;
    CustName : string;
    MrCustTypeCode: string;
    MrCustRelationshipDescr : string;
    BirthPlace : string;
    BirthDt : Date;

    constructor(){
        this.AppCustId = 0;
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.MrCustRelationshipDescr = "";
        this.BirthPlace = "";
        this.BirthDt = new Date();
    }
}