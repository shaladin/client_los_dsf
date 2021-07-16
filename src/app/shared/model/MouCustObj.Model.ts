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
    constructor() { this.MouCustId = 0; this.RowVersion = '' }
}