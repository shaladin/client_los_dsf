export class AppFeeObj {
    AppFeeId : number
    AppId: number;
    MrFeeTypeCode : string;
    FeeType : string;
    FeeTypeName : string;
    StdFeeAmt : number;
    SellFeeAmt : number;
    AppFeeAmt : number;
    StdFeePrcnt : number;
    SellFeePrcnt : number;
    AppFeePrcnt : number;
    IsCptlz : number;
    // CptlzAmt : number;
    FeeCapitalizeType : string;
    FeeCapitalizeAmt : number;
    FeeCapitalizePrcntg : number;
    FeeNotFoundList: Array<string>;
    constructor() { }
}