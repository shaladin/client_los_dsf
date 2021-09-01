import { ResultRefundObj } from "app/shared/model/AppFinData/ResultRefund.Model";


export class AppFinDataObjX {
    AppFinDataId: number;
    AppId: number;
    MrInstSchemeCode: string;
    InstSchemeName: string;
    NumOfInst: number;
    RateType: string;
    TotalAR: number;
    TotalAssetPriceAmt: number;
    TotalInterestAmt: number;
    GrossYieldPrcnt: number;
    TdpPaidCoyAmt: number;
    NtfAmt: number;
    InsCptlzAmt: number;
    LifeInsCptlzAmt: number;
    LcInstAdminFeeAmt: number;
    InstAmt: number;
    BalloonValueAmt: number;
    DiffRateAmt: number;
    InterestType: string;
    StdEffectiveRatePrcnt: number;
    EffectiveRatePrcnt: number;
    EffectiveRateBhv: string;
    FlatRatePrcnt: number;
    SellSupplEffectiveRatePrcnt: number;
    SupplFlatRatePrcnt: number;
    MrGracePeriodTypeCode: string;
    GracePeriodTypeName: string;
    GracePeriod: number;
    DownPaymentNettAmt: number;
    DownPaymentGrossAmt: number;
    TotalDownPaymentNettAmt: number;
    TotalDownPaymentGrossAmt: number;
    Ltv: number;
    Dsr: number;
    ResidualValueAmt: number;
    TotalFeeAmt: number;
    TotalFeeCptlzAmt: number;
    MrProvisionFeeCalcMethodCode: string;
    MrProvisionFeeTypeCode: string;
    RoundingAmt: number;
    CummulativeTenor: number;
    ApvAmt: number;
    MaxAllocatedRefundAmt: number;
    CommissionAllocatedAmt: number;
    ReservedFundAllocatedAmt: number;
    TotalInsCustAmt: number;
    TotalInsInscoAmt: number;
    TotalLifeInsCustAmt: number;
    TotalLifeInsInscoAmt: number;
    TotalAr: number;
    MrInstTypeCode: string;
    InstTypeName: string;
    MrSingleInstCalcMthdCode: string;
    SingleInstCalcMthdName: string;
    InvcDt: Date;
    TopBased: string;
    TopBasedName: string;
    EstEffDt: Date;
    TotalInvcAmt: number;
    TopDays: number;
    TopInterestRatePrcnt: number;
    RetentionPrcnt: number;
    MaturityDate: Date;
    TotalRetentionAmt: number;
    TotalDisbAmt: number;
    Tenor: number;
    RefundInterestAmt: number;
    LcRate: number;
    MrLcCalcMethodCode: string;
    LcGracePeriod: number;
    PrepaymentPenaltyRate: number;
    SellEffectiveRatePrcnt: number;
    TotalDpAmt: number;
    ExpenseAmount: number;
    ResultRefundRsvFundObjs: Array<ResultRefundObj>;
    VendorAtpmCode: string;
    MinEffectiveRatePrcnt: number;
    MaxEffectiveRatePrcnt: number;
    MinInterestIncomeAmt: number;
    MinGrossYieldPrcnt: number;
    MaxGrossYieldPrcnt: number;
    MinBalloonAmt: number;
    MaxBalloonAmt: number;
    BalloonBhv: string;
    MinDownPaymentNettPrcnt: number;
    MaxDownPaymentNettPrcnt: number;
    AppSupplEffectiveRatePrcnt: number;
    TotalTopAmount: number;
    SubsidyATPMRiskAmt: number;
    SubsidyATPMInterestAmt: number;
    NumOfAsset: number;
    SubsidySPAFAmt: number;
    TotalSubsidySubventionAmt: number;
    TotalSubsidySPAFAmt: number;
    SubsidySubventionAmt: number;

    TotalAssetPriceAmtOnly: number;
    MrInstSchemeName: string;
    MrFirstInstTypeCode: string;
    MrFirstInstTypeName: string;
    CommissionAmtFromDiffRate: number;
    SubsidyAmtFromDiffRate: number;
    ExistingFinData: boolean;
    constructor() {
    }
}
