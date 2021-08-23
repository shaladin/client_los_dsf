import { AppFeeObj } from "app/shared/model/AppFeeObj.Model";


export class CalcEvenPrincipleObjX {
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
    TotalSubsidySubventionAmt: number;
    TotalSubsidySPAFAmt: number;
    StdEffectiveRatePrcnt: number;
    constructor() {
    }
}
