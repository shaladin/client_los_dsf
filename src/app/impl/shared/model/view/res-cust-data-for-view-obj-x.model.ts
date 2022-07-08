import { ResAppCustBankAccForViewObj } from "app/shared/model/response/view/res-app-cust-bank-acc-for-view-obj.model";

export class ResCustDataPersonalForViewObj {
    AppCustObj: ResAppCustForViewObj;
    ListAppCustAddrObj: Array<ResAppCustAddrForViewObj>;
    ListAppCustBankAccObj: Array<ResAppCustBankAccForViewObj>;
    ListAppCustGrpObj: Array<ResAppCustGrpForViewObj>;
    ListAppCustFamilyObj: Array<ResAppCustCompletionObj>;
    ListAppCustPersonalFinDataObjs: Array<ResAppCustPersonalFinDataForViewObj>;
    ListCustFinDataAttrContent: Array<ResAppCustFinDataAttrContentForViewObj>;
    AppCustOtherInfoForViewObj: ResAppCustOtherInfoForViewObj;
    ListAppCustAttrContentObj: Array<ResAppCustAttrForViewObj>;

    constructor() {
        this.AppCustObj = new ResAppCustForViewObj();
        this.ListAppCustAddrObj = new Array<ResAppCustAddrForViewObj>();
        this.ListAppCustBankAccObj = new Array<ResAppCustBankAccForViewObj>();
        this.ListAppCustGrpObj = new Array<ResAppCustGrpForViewObj>();
        this.ListAppCustFamilyObj = new Array<ResAppCustCompletionObj>();
        this.ListAppCustPersonalFinDataObjs = new Array<ResAppCustPersonalFinDataForViewObj>();
        this.AppCustOtherInfoForViewObj = new ResAppCustOtherInfoForViewObj();
        this.ListAppCustAttrContentObj = new Array<ResAppCustAttrForViewObj>();
    }
}


export class ResCustDataPersonalForViewObjX {
    AppCustObj: ResAppCustForViewObj;
    ListAppCustAddrObj: Array<ResAppCustAddrForViewObj>;
    ListAppCustBankAccObj: Array<ResAppCustBankAccForViewObj>;
    ListAppCustGrpObj: Array<ResAppCustGrpForViewObj>;
    ListAppCustFamilyObj: Array<ResAppCustCompletionObj>;
    ListAppCustPersonalFinDataObjs: Array<ResAppCustPersonalFinDataForViewObj>;
    ListCustFinDataAttrContent: Array<ResAppCustFinDataAttrContentForViewObj>;
    AppCustOtherInfoForViewObj: ResAppCustOtherInfoForViewObj;
    ListAppCustAttrContentObj: Array<ResAppCustAttrForViewObj>;
    ListAppCustPersonalFinDataXObjs: Array<ResAppCustPersonalFinDataForViewObjX>;

    constructor() {
        this.AppCustObj = new ResAppCustForViewObj();
        this.ListAppCustAddrObj = new Array<ResAppCustAddrForViewObj>();
        this.ListAppCustBankAccObj = new Array<ResAppCustBankAccForViewObj>();
        this.ListAppCustGrpObj = new Array<ResAppCustGrpForViewObj>();
        this.ListAppCustFamilyObj = new Array<ResAppCustCompletionObj>();
        this.ListAppCustPersonalFinDataObjs = new Array<ResAppCustPersonalFinDataForViewObj>();
        this.AppCustOtherInfoForViewObj = new ResAppCustOtherInfoForViewObj();
        this.ListAppCustAttrContentObj = new Array<ResAppCustAttrForViewObj>();
        this.ListAppCustPersonalFinDataXObjs = new Array<ResAppCustPersonalFinDataForViewObjX>();
    }
}

export class ResCustDataCompanyForViewObjX {
    AppCustObj: ResAppCustForViewObj;
    ListAppCustAddrObj: Array<ResAppCustAddrForViewObj>;
    ListAppCustBankAccObj: Array<ResAppCustBankAccForViewObj>;
    ListAppCustGrpObj: Array<ResAppCustGrpForViewObj>;
    ListAppCustCompanyMgmntShrholderObjX: Array<ResAppCustCompanyMgmntShrholderForViewObjX>;
    ListAppCustCompanyLegalDocObj: Array<ResAppCustCompanyLegalDocForViewObj>;
    ListAppCustCompanyFinData: Array<ResAppCustCompanyFinDataForViewObj>;
    ListCustFinDataAttrContent: Array<ResAppCustFinDataAttrContentForViewObj>;
    AppCustOtherInfoForViewObj: ResAppCustOtherInfoForViewObj;
    ListAppCustAttrContentObj: Array<ResAppCustAttrForViewObj>;
    ListAppCustCompanyFinDataX: Array<ResAppCustCompanyFinDataForViewObjX>;

    constructor() {
        this.AppCustObj = new ResAppCustForViewObj();
        this.ListAppCustAddrObj = new Array<ResAppCustAddrForViewObj>();
        this.ListAppCustBankAccObj = new Array<ResAppCustBankAccForViewObj>();
        this.ListAppCustGrpObj = new Array<ResAppCustGrpForViewObj>();
        this.ListAppCustCompanyMgmntShrholderObjX = new Array<ResAppCustCompanyMgmntShrholderForViewObjX>();
        this.ListAppCustCompanyLegalDocObj = new Array<ResAppCustCompanyLegalDocForViewObj>();
        this.ListAppCustCompanyFinData = new Array<ResAppCustCompanyFinDataForViewObj>();
        this.ListCustFinDataAttrContent = new Array<ResAppCustFinDataAttrContentForViewObj>();
        this.AppCustOtherInfoForViewObj = new ResAppCustOtherInfoForViewObj();
        this.ListAppCustAttrContentObj = new Array<ResAppCustAttrForViewObj>();
        this.ListAppCustCompanyFinDataX = new Array<ResAppCustCompanyFinDataForViewObjX>();
    }
}

export class ResAppCustForViewObj {
    AppCustId: number;
    IsFamily: boolean;
    IsGuarantor: boolean;
    IsShareholder: boolean;
    MrCustModelCode: string;

    constructor() {
        this.AppCustId = 0;
        this.IsFamily = false;
        this.IsGuarantor = false;
        this.IsShareholder = false;
        this.MrCustModelCode = "";
    }
}

export class ResAppCustAddrForViewObj {
    CustAddrTypeName: string;
    FullAddr: string;
    HouseOwnershipName: string;
    PhoneNo: string;
    PhoneNo2: string;

    constructor() {
        this.CustAddrTypeName = "";
        this.FullAddr = "";
        this.HouseOwnershipName = "";
        this.PhoneNo = "";
        this.PhoneNo2 = "";
    }
}

export class ResAppCustBankAccStmntForViewObj {
    Month: string;
    Year: string;
    DebitAmt: number;
    CreditAmt: number;
    BalanceAmt: number;

    constructor() {
        this.Month = "";
        this.Year = "";
        this.DebitAmt = 0;
        this.CreditAmt = 0;
        this.BalanceAmt = 0;
    }
}

export class ResAppCustGrpForViewObj {
    CustName: string;
    CustNo: string;
    ApplicantNo: string;

    constructor() {
        this.CustName = "";
        this.CustNo = "";
        this.ApplicantNo = "";
    }
}

export class ResAppCustCompletionObj {
    AppCustId: number;
    CustName: string;
    MrCustTypeCode: string;
    MrCustRelationshipDescr: string;
    BirthPlace: string;
    BirthDt: Date;

    constructor() {
        this.AppCustId = 0;
        this.CustName = "";
        this.MrCustTypeCode = "";
        this.MrCustRelationshipDescr = "";
        this.BirthPlace = "";
        this.BirthDt = new Date();
    }
}

export class ResAppCustCompanyMgmntShrholderForViewObjX {
    AppCustId: number;
    SharePrcnt: number;
    EstablishmentDt: Date;
    BirthDt: Date;
    JobPositionName: string;
    CustTypeName: string;
    MrCustRelationshipDescr: string;
    MgmntShrholderName: string;
    MrCustTypeCode: string;
    TaxIdNo: string;
    IsSigner: boolean;
    IsOwner: boolean;
    IsActive: boolean;
    IdNo: string;
    PositionSlik: string;

    constructor() {
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
        this.IdNo  = "";
        this.PositionSlik = "";
    }
}

export class ResAppCustCompanyLegalDocForViewObj {
    DocDt: Date;
    DocExpiredDt: Date;
    LegalDocName: string;
    DocNo: string;

    constructor() {
        this.DocDt = new Date();
        this.DocExpiredDt = new Date();
        this.LegalDocName = "";
        this.DocNo = "";
    }
}

export class ResAppCustPersonalFinDataForViewObj {
    AppCustPersonalFinDataId: number;
    AppCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeTypeCode: string;
    MrSourceOfIncomeTypeDescr: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    OtherIncomeAmt: number;
    OtherMonthlyInstAmt: number;
    TotalIncomeAmt: number;
    TotalMonthlyExpenseAmt: number;
    NettIncomeAmt: number;
    DateAsOf: Date;
    OtherMonthlyInstallmentDsf:number;
}

export class ResAppCustPersonalFinDataForViewObjX {
    AppCustPersonalFinDataId: number;
    AppCustPersonalId: number;
    MonthlyIncomeAmt: number;
    MonthlyExpenseAmt: number;
    MonthlyInstallmentAmt: number;
    MrSourceOfIncomeTypeCode: string;
    MrSourceOfIncomeTypeDescr: string;
    SpouseMonthlyIncomeAmt: number;
    IsJoinIncome: boolean;
    OtherIncomeAmt: number;
    OtherMonthlyInstAmt: number;
    TotalIncomeAmt: number;
    TotalMonthlyExpenseAmt: number;
    NettIncomeAmt: number;
    DateAsOf: Date;
}

export class ResAppCustCompanyFinDataForViewObj{
    AppCustCompanyFinDataId: number;
    AppCustId:number;
    GrossMonthlyIncomeAmt:number;
    GrossMonthlyExpenseAmt:number;
    GrossProfitAmt:number;
    ReturnOfInvestmentPrcnt:number;
    ReturnOfEquityPrcnt:number;
    ReturnOfAssetPrcnt:number;
    ProfitMarginPrcnt:number;
    CurrentRatioPrcnt:number
    DebtEquityRatioPrcnt:number
    InvTurnOverPrcnt:number;
    ArTurnOverPrcnt: number;
    GrowthPrcnt: number;
    WorkingCapitalAmt:number;
    OthMonthlyInstAmt:number;
    DateAsOf: Date;
    Revenue:number;
    OprCost:number;
    ProfitBeforeTax:number;
    CurrAsset:number;
    NetFixedAsset:number;
    TotalAsset:number;
    CurrLiablts:number;
    LongTermLiablts:number;
    ShareholderEquity:number;
    CurrRatio:number;

    constructor(){
        this.AppCustCompanyFinDataId = 0;
        this.AppCustId = 0;
        this.GrossMonthlyIncomeAmt=0;
        this.GrossMonthlyExpenseAmt=0;
        this.GrossProfitAmt=0;
        this.ReturnOfInvestmentPrcnt=0;
        this.ReturnOfEquityPrcnt=0;
        this.ReturnOfAssetPrcnt=0;
        this.ProfitMarginPrcnt=0;
        this.CurrentRatioPrcnt=0;
        this.DebtEquityRatioPrcnt=0;
        this.InvTurnOverPrcnt=0;
        this.ArTurnOverPrcnt=0;
        this.GrowthPrcnt=0;
        this.WorkingCapitalAmt=0;
        this.OthMonthlyInstAmt=0;
        this.DateAsOf=new Date();
        this.Revenue=0;
        this.OprCost=0;
        this.ProfitBeforeTax=0;
        this.CurrAsset=0;
        this.NetFixedAsset=0;
        this.TotalAsset=0;
        this.CurrLiablts=0;
        this.LongTermLiablts=0;
        this.ShareholderEquity=0;
        this.CurrRatio=0;
    }
}

export class ResAppCustCompanyFinDataForViewObjX{
    AppCustCompanyFinDataId: number;
    AppCustId:number;
    GrossMonthlyIncomeAmt:number;
    GrossMonthlyExpenseAmt:number;
    GrossProfitAmt:number;
    ReturnOfInvestmentPrcnt:number;
    ReturnOfEquityPrcnt:number;
    ReturnOfAssetPrcnt:number;
    ProfitMarginPrcnt:number;
    CurrentRatioPrcnt:number
    DebtEquityRatioPrcnt:number
    InvTurnOverPrcnt:number;
    ArTurnOverPrcnt: number;
    GrowthPrcnt: number;
    WorkingCapitalAmt:number;
    OthMonthlyInstAmt:number;
    DateAsOf: Date;
    Revenue:number;
    OprCost:number;
    ProfitBeforeTax:number;
    CurrAsset:number;
    NetFixedAsset:number;
    TotalAsset:number;
    CurrLiablts:number;
    LongTermLiablts:number;
    ShareholderEquity:number;
    CurrRatio:number;
    OtherMonthlyInstallmentDsf:number;

    constructor(){
        this.AppCustCompanyFinDataId = 0;
        this.AppCustId = 0;
        this.GrossMonthlyIncomeAmt=0;
        this.GrossMonthlyExpenseAmt=0;
        this.GrossProfitAmt=0;
        this.ReturnOfInvestmentPrcnt=0;
        this.ReturnOfEquityPrcnt=0;
        this.ReturnOfAssetPrcnt=0;
        this.ProfitMarginPrcnt=0;
        this.CurrentRatioPrcnt=0;
        this.DebtEquityRatioPrcnt=0;
        this.InvTurnOverPrcnt=0;
        this.ArTurnOverPrcnt=0;
        this.GrowthPrcnt=0;
        this.WorkingCapitalAmt=0;
        this.OthMonthlyInstAmt=0;
        this.DateAsOf=new Date();
        this.Revenue=0;
        this.OprCost=0;
        this.ProfitBeforeTax=0;
        this.CurrAsset=0;
        this.NetFixedAsset=0;
        this.TotalAsset=0;
        this.CurrLiablts=0;
        this.LongTermLiablts=0;
        this.ShareholderEquity=0;
        this.CurrRatio=0;
        this.OtherMonthlyInstallmentDsf=0;
    }
}

export class ResAppCustFinDataAttrContentForViewObj{
    AttrCode:string;
    AttrName:string;
    AttrValue:string;
    AttrInputType:string;

    constructor(){
        this.AttrCode="";
        this.AttrName="";
        this.AttrValue="0";
        this.AttrInputType="";
    }
}

export class ResAppCustOtherInfoForViewObj{
    LbppmsCntrprtLbppDescr: string;
    LbppmsDebtGrpLbppDescr: string;
    LbppmsBizSustainLbppDescr: string;
    LbppmsBizSclLbppDescr: string;

    constructor(){
        this.LbppmsCntrprtLbppDescr="";
        this.LbppmsDebtGrpLbppDescr="";
        this.LbppmsBizSustainLbppDescr="";
        this.LbppmsBizSclLbppDescr="";
    }
}

export class ResAppCustAttrForViewObj{
    AttrCode: string;
    AttrName: string;
    AttrInputType: string;
    AttrValue: string;
    MasterCode: string;

    constructor(){
        this.AttrCode="";
        this.AttrName="";
        this.AttrInputType="";
        this.AttrValue="";
        this.MasterCode="";
    }
}