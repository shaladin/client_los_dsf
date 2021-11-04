import { AppFeeObj } from "../app-fee-obj.model";
import { CrdRvwAllocObj } from "./crd-rvw-alloc-obj.model";

export class CrdRvwCustInfoIncomeAndExpenseDetailsObj {

    TotalInterestAmt: number;
    InsAmt: number;
    LifeInsAmt: number;
    SubsidyRateAmt: number;
    CommissionAmt: number;
    ReserveFundAmt: number;
    ListAppFeeObj: Array<AppFeeObj>;
    ListCrdRvwAllocObj: Array<CrdRvwAllocObj>;
    constructor() {
        this.ListAppFeeObj = new Array<AppFeeObj>();
        this.ListCrdRvwAllocObj = new Array<CrdRvwAllocObj>();
    }
}