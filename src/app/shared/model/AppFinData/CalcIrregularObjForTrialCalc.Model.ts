import { AppFeeObj } from "../AppFeeObj.Model";
import { EntryInstObj } from "./EntryInstObj.Model";

export class CalcIrregularObjForTrialCalc {
    Tenor: number;
    MrFirstInstTypeCode: string;
    BizTemplateCode: string;
    LobCode: string;
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
    IsRecalculate: boolean;
    EffectiveRatePrcnt: number;
    FlatRatePrcnt: number;
    Fees: Array<AppFeeObj> = new Array<AppFeeObj>()
    ListEntryInst: Array<EntryInstObj> = new Array<EntryInstObj>()

    constructor() {
    }
}
