import { InstallmentObj } from "./installment-obj.model";
import { AppInstStepSchmObj } from "../app-inst-step-schm/app-inst-step-schm-obj.model";

export class ResponseCalculateObj {
    AppId : number
    TotalInterestAmt : number
    GrossYieldPrcnt : number
    NtfAmt : number
    InstAmt : number
    TotalDownPaymentNettAmt : number
    TotalDownPaymentGrossAmt : number
    RoundingAmt : number
    CummulativeTenor : number
    EffectiveRatePrcnt : number
    FlatRatePrcnt : number
    EffectiveRatePerInst : number
    TotalARAmt : number
    TotalPrincipalAmt : number
    InstallmentTable : Array<InstallmentObj> = new Array<InstallmentObj>()
    AppInstStepSchmObjs: Array<AppInstStepSchmObj> = new Array<AppInstStepSchmObj>();
    DiffRateAmt: number;
    RefundInterestAmt: number;
    TotalDisbAmt: number;
    ApvAmt: number;
    TotalLifeInsCustAmt: number;
    LifeInsCptlzAmt: number;
    DownPaymentGrossAmt: number;
    DownPaymentNettAmt: number;
    SubsidyAmtFromDiffRate: number;
    CommissionAmtFromDiffRate: number;
    AppSupplEffectiveRatePrcnt: number;
    constructor() {
    }
}
