import { AppFeeObj } from "app/shared/model/app-fee-obj.model";
import { EntryInstObj } from "app/shared/model/app-fin-data/entry-inst-obj.model";


export class CalcIrregularObjX {
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
    Fees : Array<AppFeeObj> = new Array<AppFeeObj>()
    ListEntryInst : Array<EntryInstObj>= new Array<EntryInstObj>()
    TotalSubsidySubventionAmt: number;
    TotalSubsidySPAFAmt: number;
    StdEffectiveRatePrcnt: number;
    constructor() {
    }
}
