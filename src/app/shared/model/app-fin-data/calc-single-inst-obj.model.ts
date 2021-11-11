import { AppFeeObj } from "../app-fee-obj.model";

export class CalcSingleInstObj {
    InvcDt : Date ;
    EstEffDt : Date ;
    TotalInvcAmt : number ;
    EffectiveRatePrcnt : number ;
    TotalInterestAmt: number ;
    InterestType : string ;
    TopDays : number ;
    TotalRetentionAmt : number ;
    AppFee : Array<AppFeeObj> = new Array<AppFeeObj>()
    TopBased: string;
    MrSingleInstCalcMthdCode: string;
    constructor() {
    }
}
