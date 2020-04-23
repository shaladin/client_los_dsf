import { AppFeeObj } from "../AppFeeObj.Model";

export class CalcEvenPrincipleObj {
    AppId : number ;
    TotalAssetPrice : number ;
    DownPaymentGrossAmt : number ;
    InsCapitalizedAmt : number ;
    LifeInsCapitalizedAmt: number ;
    GracePeriod : number ;
    GracePeriodType : string ;
    RateType : string ;
    EffectiveRatePrcnt : number ;
    FlatRatePrcnt : number ;
    Fees : Array<AppFeeObj> = new Array<AppFeeObj>()

    constructor() {
    }
}
