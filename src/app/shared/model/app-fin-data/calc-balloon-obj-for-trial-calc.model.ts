import { AppFeeObj } from "../app-fee-obj.model";

export class CalcBalloonObjForTrialCalc {
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
    BalloonValueAmt: number;
    ProdOfferingCode: string;
    ProdOfferingVersion: string;

    Fees: Array<AppFeeObj> = new Array<AppFeeObj>()

    constructor() {
    }
}
