export class NapAppReferantorModel{
    AppReferantorId: number;
    AppId: number;
    ReferantorCode: string;
    ReferantorName: string;
    MrReferantorType: string;
    MrReferantorTypeName: string;
    ReferantorCategory: string;
    RefBankCode: string;
    BankName: string;
    BankAccName: string;
    BankAccNo: string;
    BankBranch: string;
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
    RowVersion: string;
    constructor () {
        this.RowVersion = "";
    }
}