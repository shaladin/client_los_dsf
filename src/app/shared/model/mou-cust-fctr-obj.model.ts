export class MouCustFctrObj {
    MouCustFctrId: number;
    MouCustId: number;
    MrRecourseTypeCode: string;
    IsDisclosed: boolean;
    WopCode: string;
    MrPaidByCode: string;
    MrPaidByCodeDesc: string;
    MrInstTypeCode: string;
    MrInstTypeCodeDesc: string;
    SingleInstCalcMthd: string;
    SingleInstCalcMthdDesc: string;
    TopDays: number;
    TenorFrom: number;
    TenorTo: number;
    PayFreqCode: string;
    MrInstSchmCode: string;
    InterestRatePrcnt: number;
    RetentionPrcnt: number;
    IsListedCust: boolean;
    Notes: string;
    CurrCode: string;
    VendorCode: string;
    InstTypeDescr: string;
    RevolvingType: string;
    RevolvingTypeDesc: string;
    RowVersion: string;
    MrFirstInstTypeCode: string;
    DownPaymentFromPrcnt: number;
    DownPaymentToPrcnt: number;
    constructor(){ this.MouCustFctrId = 0; this.RowVersion = '' }
}