import { ResAppCustBankAccForViewObj } from "./ResAppCustBankAccForViewObj.model";

export class ResCustDataPersonalForViewObj {
    AppCustObj : ResAppCustForViewObj;
    ListAppCustAddrObj : Array<ResAppCustAddrForViewObj>;
    ListAppCustBankAccObj : Array<ResAppCustBankAccForViewObj>;
    ListAppCustGrpObj : Array<ResAppCustGrpForViewObj>;
    ListAppCustFamilyObj : Array<ResAppCustCompletionObj>;

    constructor(){
        this.AppCustObj = new ResAppCustForViewObj();
        this.ListAppCustAddrObj = new Array<ResAppCustAddrForViewObj>();
        this.ListAppCustBankAccObj = new Array<ResAppCustBankAccForViewObj>();
        this.ListAppCustGrpObj = new Array<ResAppCustGrpForViewObj>();
        this.ListAppCustFamilyObj = new Array<ResAppCustCompletionObj>();
    }
}

export class ResCustDataCompanyForViewObj {
    AppCustObj : ResAppCustForViewObj;
    ListAppCustAddrObj : Array<ResAppCustAddrForViewObj>;
    ListAppCustBankAccObj : Array<ResAppCustBankAccForViewObj>;
    ListAppCustGrpObj : Array<ResAppCustGrpForViewObj>;
    ListAppCustCompanyMgmntShrholderObj : Array<ResAppCustCompanyMgmntShrholderForViewObj>;
    ListAppCustCompanyLegalDocObj : Array<ResAppCustCompanyLegalDocForViewObj>;

    constructor(){
        this.AppCustObj = new ResAppCustForViewObj();
        this.ListAppCustAddrObj = new Array<ResAppCustAddrForViewObj>();
        this.ListAppCustBankAccObj = new Array<ResAppCustBankAccForViewObj>();
        this.ListAppCustGrpObj = new Array<ResAppCustGrpForViewObj>();
        this.ListAppCustCompanyMgmntShrholderObj = new Array<ResAppCustCompanyMgmntShrholderForViewObj>();
        this.ListAppCustCompanyLegalDocObj = new Array<ResAppCustCompanyLegalDocForViewObj>();
    }
}

export class ResAppCustForViewObj {
    AppCustId : number;
    IsFamily : boolean;
    IsGuarantor : boolean;
    IsShareholder : boolean;
    MrCustModelCode : string;

    constructor(){
        this.AppCustId = 0;
        this.IsFamily = false;
        this.IsGuarantor = false;
        this.IsShareholder = false;
        this.MrCustModelCode = "";
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

export class ResAppCustBankAccStmntForViewObj {
    Month : string;
    Year : string;
    DebitAmt : number;
    CreditAmt : number;
    BalanceAmt : number;

    constructor(){
        this.Month = "";
        this.Year = "";
        this.DebitAmt = 0;
        this.CreditAmt = 0;
        this.BalanceAmt = 0;
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

export class ResAppCustCompanyMgmntShrholderForViewObj {
    AppCustId : number;
    SharePrcnt : number;
    EstablishmentDt : Date;
    BirthDt : Date;
    JobPositionName : string;
    CustTypeName : string;
    MrCustRelationshipDescr : string;
    MgmntShrholderName : string;
    MrCustTypeCode : string;
    TaxIdNo : string;
    IsSigner : boolean;
    IsOwner : boolean;
    IsActive : boolean;

    constructor(){
        this.AppCustId = 0;
        this.SharePrcnt = 0;
        this.EstablishmentDt = new Date();
        this.BirthDt = new Date();
        this.JobPositionName = "";
        this.CustTypeName = "";
        this.MrCustRelationshipDescr = "";
        this.MgmntShrholderName = "";
        this.MrCustTypeCode = "";
        this.TaxIdNo = "";
        this.IsSigner = false;
        this.IsOwner = false;
        this.IsActive = false;
    }
}

export class ResAppCustCompanyLegalDocForViewObj {
    DocDt : Date;
    DocExpiredDt : Date;
    LegalDocName : string;
    DocNo : string;

    constructor(){
        this.DocDt = new Date();
        this.DocExpiredDt = new Date();
        this.LegalDocName = "";
        this.DocNo = "";
    }
}