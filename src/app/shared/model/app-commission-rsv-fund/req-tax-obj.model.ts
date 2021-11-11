export class ReqTaxObj {
    AppId: number;
    VendorCode: Array<string>;
    VendorEmpNo: Array<string>;
    TrxAmt: Array<Array<number>>;
    TrxTypeCode: string;
    ExchangeRateAmt: string;
    IsSave: boolean;
    constructor() {
        this.AppId = 0;
        this.VendorCode = new Array();
        this.VendorEmpNo = new Array();
        this.TrxAmt = new Array();
        this.TrxTypeCode = "";
        this.ExchangeRateAmt = "";
        this.IsSave = false;
    }
}