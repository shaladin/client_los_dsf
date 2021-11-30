import { AppFeeObj } from "../app-fee-obj.model";
import { EntryInstObj } from "./entry-inst-obj.model";

export class CalcStepUpStepDownObj {
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
    Fees : Array<AppFeeObj> = new Array<AppFeeObj>();
    ListEntryInst: Array<EntryInstObj> = new Array<EntryInstObj>();

    constructor() {
    }
}
