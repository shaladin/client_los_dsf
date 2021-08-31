export class CessieDsfObj {
    CessieId: number;
    CessieNo: string;
    CessieDate: string;
    ClientName: string;
    PaymentAmount: string;
    BankName: string;
    PaymentDueDate: any;
    AccountName: string;
    RowVersion: any;

    constructor()
    {
        this.CessieId = 0;
        this.CessieNo = "";
        this.CessieDate = "";
        this.ClientName = "";
        this.PaymentAmount = "";
        this.PaymentAmount = "";
        this.BankName = "";
        this.AccountName = "";
        this.RowVersion = "";
    }
}