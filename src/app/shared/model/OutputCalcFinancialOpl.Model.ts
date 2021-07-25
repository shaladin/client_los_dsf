import { AppCashFlowItemObj } from "./AppCashFlowItem,Model";
import { CashInCashOutObj } from "./CashInCashOut.Model";

export class OutputCalcFinancialOplObj {
    TotalCost: number;
    MarginAmt: number;
    MarginPrcnt: number;
    RentAmt: number;
    TotalRentAmt: number;
    GrossYieldPrcnt: number;
    ListCashInCashOut: Array<CashInCashOutObj>;
    AppCashFlowItemObjs: Array<AppCashFlowItemObj>;

    constructor() {
        this.TotalCost = 0;
        this.MarginAmt = 0;
        this.MarginPrcnt = 0;
        this.RentAmt = 0;
        this.TotalRentAmt = 0;
        this.GrossYieldPrcnt = 0;
        this.ListCashInCashOut = new Array<CashInCashOutObj>();
        this.AppCashFlowItemObjs = new Array<AppCashFlowItemObj>();
    }
}