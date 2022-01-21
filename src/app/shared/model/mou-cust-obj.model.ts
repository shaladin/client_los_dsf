export class MouCustObj {
    MouCustId: number;
    MouCustNo: string;
    MouCustDt: Date;
    TopupMouCustId: number;
    CustNo: string;
    CustName: string;
    StartDt: Date;
    EndDt: Date;
    RefNo: string;
    IsRevolving: boolean;
    CurrCode: string;
    PlafondAmt: number;
    RealisationAmt: number;
    MouStat: string;
    MrMouTypeCode: string;
    Notes: string;
    SrvyOrderNo: string;
    MrCustTypeCode: string;
    MouCustStatView: string;
    IdExpiredDt: Date;
    IdNo: string;
    IsVip: boolean;
    MrIdTypeCode: string;
    TaxIdNo: string;
    IsExistingCust: boolean;
    CustModelCode: string;
    ApplicantNo: string;
    RowVersion: string;
    IsFreeze: boolean;
    PlafondType: string;
    PlafondCollateralAmt: number;
    IsAffiliateWithMf: boolean;
    OriOfficeCode: string;
    OriOfficeName: string;
    CrtOfficeCode: string;
    CrtOfficeName: string;
    constructor() { this.MouCustId = 0; this.RowVersion = '' }
}

export class ReqMouCustObj {
    MouCustId: number;
    MouCustNo: string;
    OriOfficeCode: string;
    OriOfficeName: string;
    CrtOfficeCode: string;
    CrtOfficeName: string;
    RefNo: string;
    PlafondAmt: number;
    MouStat: string;
    MrMouTypeCode: string;
    MrRevolvingTypeCode: string;
    PlafondType: string;
    StartDt: Date;
    EndDt: Date;
    IsRevolving: boolean;
    IsFreeze: boolean;
    RowVersion: string;

    constructor() { 
        this.MouCustId = 0;
        this.MouCustNo = "";
        this.OriOfficeCode = "";
        this.OriOfficeName = "";
        this.CrtOfficeCode = "";
        this.CrtOfficeName = "";
        this.RefNo = "";
        this.PlafondAmt = 0;
        this.MouStat = "";
        this.MrMouTypeCode = "";
        this.MrRevolvingTypeCode = "";
        this.PlafondType = "";
        this.IsRevolving = false;
        this.IsFreeze = false;
        this.RowVersion = ""}
}