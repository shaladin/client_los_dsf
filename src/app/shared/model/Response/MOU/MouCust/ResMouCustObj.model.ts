export class ResMouCustObj {
    MouCustId: number;
    MouCustNo: string;
    MrCustTypeCode: string;
    MouCustDt: Date;
    TopupMouCustId: number;
    CustNo: string;
    ApplicantNo: string;
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
    InProcessAmt: number;
    AvailableAmt: number;
    MouCustStatView: string;
    MrRevolvingTypeCode: string;
    IsExistingCust: boolean;
    IsFreeze: boolean;
    IdExpiredDt: Date;
    RowVersion: string;
    
    constructor() { this.MouCustId = 0; this.RowVersion = '' }
}