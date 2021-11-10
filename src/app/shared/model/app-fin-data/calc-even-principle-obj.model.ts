import { AppFeeObj } from "../app-fee-obj.model";

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
