import { AppFeeObj } from "../AppFeeObj.Model";

export class CalcRegularFixObj {
    AppId : number ;
    TotalAssetPriceAmt : number ;
    TotalAccessoryPriceAmt : number ;
    TotalDpAmt : number ;
    TotalAccessoryDownPaymentAmt : number ;
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

    constructor() {
    }
}
