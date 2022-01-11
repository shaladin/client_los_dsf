export class ResGetRefTaxOfficeDetailObj {
    RefTaxOfficeId: number;
    TaxOfficeCode: string;
    TaxOfficeName: string;
    IsActive: boolean;
    RefBankId: number;
    BankName: string;
    BankAccNo: string;
    BankAccName: string;
    BankBranchBiCode: string;
    RowVersion: string;

    constructor() {
        this.RefTaxOfficeId = 0;
        this.TaxOfficeCode = "";
        this.TaxOfficeName = "";
        this.IsActive = false;
        this.RefBankId = 0;
        this.BankName = "";
        this.BankAccNo = "";
        this.BankAccName = "";
        this.BankBranchBiCode = "";
        this.RowVersion = "";
    }
}