import { AppFeeObj } from "app/shared/model/app-fee-obj.model";


export class CalcBalloonObjX {
    AppId : number ;
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
    BalloonValueAmt : number;
    TotalSubsidySubventionAmt: number;
    TotalSubsidySPAFAmt: number;
    Fees : Array<AppFeeObj> = new Array<AppFeeObj>()
    StdEffectiveRatePrcnt: number;
    constructor() {
    }
}
