export class ReceiptDsfObj {
    ReceiptFormDsfId: string;
    CessieNo: string;
    InvoiceNo: string;
    KwitansiNo: string;
    TandaTerimaNo: string;
    AgrmntFacNo: string;
    AgrmntFacDt: Date;
    DocSignCol: string;
    PositionSignCol: string;
    OfficeCode: string;
    RowVersion: any;

    constructor()
    {
        this.ReceiptFormDsfId = "";
        this.CessieNo = "";
        this.InvoiceNo = "";
        this.KwitansiNo = "";
        this.TandaTerimaNo = "";
        this.AgrmntFacNo = "";
        this.AgrmntFacDt = new Date();
        this.DocSignCol = "";
        this.PositionSignCol = "";
        this.OfficeCode = "";
        this.RowVersion = "";
    }
}