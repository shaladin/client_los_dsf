export class ResAgrmntActivationFinDataAndFeeObj {
    ListAppFeeObj : Array<ResAppFeeObj>;
    AppFinDataObj : ResponseAppFinDataObj;

    constructor(){
        this.ListAppFeeObj = new Array<ResAppFeeObj>();
        this.AppFinDataObj = new ResponseAppFinDataObj();
    }
}

export class ResAppFeeObj {
    AppFeeAmt : number;
    FeeName : string;

    constructor(){
        this.AppFeeAmt = 0;
        this.FeeName = "";
    }
}

export class ResponseAppFinDataObj {
    TotalAssetPriceAmt : number;
    TotalDownPaymentNettAmt : number;
    NtfAmt : number;
    TotalInsCustAmt : number;
    InsCptlzAmt : number;
    InstAmt : number;

    constructor(){
        this.TotalAssetPriceAmt = 0;
        this.TotalDownPaymentNettAmt = 0;
        this.NtfAmt = 0;
        this.TotalInsCustAmt = 0;
        this.InsCptlzAmt = 0;
        this.InstAmt = 0;
    }
}