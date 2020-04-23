import { AppFeeObj } from "../AppFeeObj.Model";

export class CalcProvisionFee {
    AppId : number ;
    TotalAssetPrice : number ;
    DownPaymentGrossAmt : number ;
    InsCapitalizedAmt : number ;
    SubsidyToPrincipal : number;
    ProvisionFeeType : string;
    ProvisionFeeSource : string;
    Fee : Array<AppFeeObj> = new Array<AppFeeObj>()

    constructor() {
    }
}
