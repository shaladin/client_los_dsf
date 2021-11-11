export class AgrmntFeeObj {
    AgrmntFeeId : number
    AgrmntId: number;
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
    CptlzAmt : number;
    FeeCapitalizeType : string;
    FeeCapitalizeAmt : number;
    FeeCapitalizePrcntg : number;
    constructor() { }
}