export class AppReferantorObj {
    AppReferantorId: number;
    AppId: number;
    ReferantorCode: string;
    ReferantorName: string;
    MrReferantorType: string;
    TaxpayerNo: string;
    TaxIdNo: string;
    TaxIdName: string;
    TaxIdAddr: string;
    TaxIdAreaCode1: string;
    TaxIdAreaCode2: string;
    TaxIdAreaCode3: string;
    TaxIdAreaCode4: string;
    TaxIdCity: string;
    TaxIdZipcode: string;
    MrTaxCalcMethod: string;
    RefBankCode: string;
    BankAccNo: string;
    BankAccName: string;
    BankBranch: string;
    ReferantorCategory: string;
    VendorId: number;
    IsNpwpExist: boolean;
    MrTaxCalcMethodCode: string;
    RowVersion: string;
  
    constructor() {
      this.AppReferantorId = 0;
      this.AppId = 0;
      this.ReferantorCode = "";
      this.ReferantorName = "";
      this.MrReferantorType = "";
      this.TaxpayerNo = "";
      this.TaxIdNo = "";
      this.TaxIdName = "";
      this.TaxIdAddr = "";
      this.TaxIdAreaCode1 = "";
      this.TaxIdAreaCode2 = "";
      this.TaxIdAreaCode3 = "";
      this.TaxIdAreaCode4 = "";
      this.TaxIdCity = "";
      this.TaxIdZipcode = "";
      this.MrTaxCalcMethod = "";
      this.RefBankCode = "";
      this.BankAccNo = "";
      this.BankAccName = "";
      this.BankBranch = "";
      this.ReferantorCategory = "";
      this.VendorId = 0;
      this.IsNpwpExist = false;
      this.MrTaxCalcMethodCode = "";
      this.RowVersion = "";
    }
}

export class ListAppReferantorObj {
    ReqListAddEditAppReferantorObjs: Array<AppReferantorObj>;
  
    constructor() {
        this.ReqListAddEditAppReferantorObjs = new Array<AppReferantorObj>();
    }
}
  