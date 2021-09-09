import { AppFeeObj } from "../AppFeeObj.Model";
import { EntryInstObj } from "./EntryInstObj.Model";

export class CalcIrregularObj {
    AppId: number;
    TotalAssetPrice: number;
    DownPaymentGrossAmt: number;
    InsCapitalizedAmt: number;
    LifeInsCapitalizedAmt: number;
    GracePeriod: number;
    GracePeriodType: string;
    RateType: string;
    InstRounding: number;
    InstAmt: number;
    IsReCalculate: boolean;
    EffectiveRatePrcnt: number;
    FlatRatePrcnt: number;
    Fees: Array<AppFeeObj> = new Array<AppFeeObj>()
    ListEntryInst: Array<EntryInstObj> = new Array<EntryInstObj>()

    constructor() {
    }
}
