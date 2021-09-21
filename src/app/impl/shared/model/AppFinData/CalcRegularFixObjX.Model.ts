import { AppFeeObj } from "app/shared/model/AppFeeObj.Model";


export class CalcRegularFixObjX {
    AppId : number ;
    TotalAssetPriceAmt : number ;
    TotalAccessoryPriceAmt : number ;
    TotalDpAmt : number ;
    TotalAccessoryDownPaymentAmt : number ;
    TotalAssetPrice : number ;
    DownPaymentGrossAmt : number ;
    InsCapitalizedAmt : number ;
    LifeInsCapitalizedAmt: number ;
    GracePeriod : number ;
    GracePeriodType : string ;
    RateType : string ;
    InstRounding : number ;
    InstAmt : number ;
    IsRecalculate : boolean ;
    EffectiveRatePrcnt : number ;
    FlatRatePrcnt : number ;
    Fees : Array<AppFeeObj> = new Array<AppFeeObj>()
    TotalSubsidySubventionAmt: number;
    TotalSubsidySPAFAmt: number;
    StdEffectiveRatePrcnt: number;
    constructor() {
    }
}
