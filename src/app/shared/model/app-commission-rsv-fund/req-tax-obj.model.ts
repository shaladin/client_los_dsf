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
export class ReqTaxV2Obj {
    AppId: number;
    VendorTaxs: Array<VendorTaxObj>;
    VendorEmpTaxs: Array<VendorEmpTaxObj>;
    ReferantorTaxs: Array<VendorTaxObj>;
    TrxTypeCode: string;
    ExchangeRateAmt: string;
    IsSave: boolean;
    TaxOfficeCode: string;
    constructor() {
        this.AppId = 0;
        this.VendorTaxs = new Array();
        this.VendorEmpTaxs = new Array();
        this.ReferantorTaxs = new Array();
        this.TrxTypeCode = "";
        this.ExchangeRateAmt = "";
        this.IsSave = false;
        this.TaxOfficeCode = "";
    }
}
export class VendorTaxObj {
    VendorCode: string;
    TrxAmt: Array<number>;
    constructor() {
        this.VendorCode = "";
        this.TrxAmt = new Array();
    }
}
export class VendorEmpTaxObj extends VendorTaxObj {
    VendorEmpNo: string;
    constructor() {
        super();
        this.VendorEmpNo = "";
    }
}