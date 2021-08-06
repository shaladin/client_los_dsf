export class AppFixedFeeObj {
    AppFixedFeeId: number;
    AppFixedId: number;
    MrFeeTypeCode: string;
    MrFeePaymentTypeCode: string;
    StdFeeAmt: number;
    SellFeeAmt: number;
    StdFeePrcnt: number;
    SellFeePrcnt: number;
    MrFeeCptlzTypeCode: string;
    CptlzPrnct: number;
    CptlzAmt: number;
    RowVersion: string;
  constructor() { this.AppFixedFeeId = 0; this.RowVersion = "" }
}
