export class LeadAppObj {
    LeadAppId: number;
    LeadId: number;
    TaskListId: number;
    CurrCode: string;
    CurrName: string;
    Tenor: number;
    NumOfAsset: number;
    MrInterestTypeCode: string;
    PayFreqCode: number;
    NumOfInst: number;
    MrInstSchemeCode: string;
    MrStepUpDownTypeCode: string;
    MrFirstInstTypeCode: string;
    EffectiveRatePrcnt: number;
    FlatRatePrcnt: number;
    GracePeriod: number;
    MrGracePeriodTypeCode: string;
    NtfAmt: number;
    RoundingAmt: number;
    TotalInterest: number;
    TotalAr: number;
    InsPremiumCapitalizedAmt: number;
    FeeCapitalizedAmt: number;
    TotalDownPaymentAmt: number;
    InstAmt: number;
    RowVersion: string;
    constructor() { this.LeadAppId = 0, this.RowVersion = "" }
}