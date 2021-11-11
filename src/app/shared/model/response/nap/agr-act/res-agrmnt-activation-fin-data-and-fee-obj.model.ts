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
    CapitalizedAmt : number;
    FeeName : string;

    constructor(){
        this.AppFeeAmt = 0;
        this.CapitalizedAmt = 0;
        this.FeeName = "";
    }
}

export class ResponseAppFinDataObj {
    TotalAssetPriceAmt : number;
    TotalDownPaymentNettAmt : number;
    NtfAmt : number;
    TotalInsCustAmt : number;
    TotalLifeInsCustAmt : number;
    TotalFeeCptlzAmt : number;
    InsCptlzAmt : number;
    InstAmt : number;
    TotalFeeAmt : number;
    LifeInsCptlzAmt : number;
    DownPaymentGrossAmt : number;
    DownPaymentNettAmt : number;
    MrFirstInstTypeCode : string;
    MrFirstInstTypeName : string;
    MrInstSchemeCode : string;
    MrInstSchemeName : string;

    constructor(){
        this.TotalAssetPriceAmt = 0;
        this.TotalDownPaymentNettAmt = 0;
        this.NtfAmt = 0;
        this.TotalFeeAmt = 0;
        this.TotalInsCustAmt = 0;
        this.TotalLifeInsCustAmt = 0;
        this.TotalFeeCptlzAmt = 0;
        this.InsCptlzAmt = 0;
        this.LifeInsCptlzAmt = 0;
        this.InstAmt = 0;
        this.DownPaymentGrossAmt = 0;
        this.DownPaymentNettAmt = 0;
        this.MrFirstInstTypeCode = "";
        this.MrFirstInstTypeName = "";
        this.MrInstSchemeCode = "";
        this.MrInstSchemeName = "";
    }
}