export class ReqTaxObjX {
    AppId: number;
    VendorCode: Array<string>;
    VendorEmpNo: Array<string>;
    TrxAmt: Array<Array<number>>;
    TrxTypeCode: string;
    ExchangeRateAmt: string;
    IsSave: boolean;
    TaxOfficeCode: string;
    constructor() {
        this.AppId = 0;
        this.VendorCode = new Array();
        this.VendorEmpNo = new Array();
        this.TrxAmt = new Array();
        this.TrxTypeCode = "";
        this.ExchangeRateAmt = "";
        this.IsSave = false;
        this.TaxOfficeCode = "";
    }
}