export class MouCustFctrObj {
    MouCustFctrId: number;
    MouCustId: number;
    MrRecourseTypeCode: string;
    IsDisclosed: boolean;
    WopCode: string;
    MrPaidByCode: string;
    MrInstTypeCode: string;
    SingleInstCalcMthd: string;
    TopDays: number;
    TenorFrom: number;
    TenorTo: number;
    PayFreqCode: string;
    MrInstSchmCode: string;
    InterestRatePrcnt: string;
    RetentionPrcnt: string;
    IsListedCust: boolean;
    Notes: string;
    CurrCode: string;
    VendorCode: string;
    InstTypeDescr: string;
    RowVersion: string;
    constructor(){ this.MouCustFctrId = 0; this.RowVersion = '' }
}