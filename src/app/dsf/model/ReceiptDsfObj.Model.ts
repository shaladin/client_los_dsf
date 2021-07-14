export class ReceiptDsfObj {
    ReceiptFormDsfId: string;
    CessieNo: string;
    InvoiceNo: string;
    KwitansiNo: string;
    TandaTerimaNo: string;
    AgrmntFacNo: string;
    AgrmntFacDt: any;
    DocSignCol: string;
    PositionSignCol: string;
    RowVersion: any;

    constructor()
    {
        this.ReceiptFormDsfId = "";
        this.CessieNo = "";
        this.InvoiceNo = "";
        this.KwitansiNo = "";
        this.TandaTerimaNo = "";
        this.AgrmntFacNo = "";
        this.AgrmntFacDt = Date.now;
        this.DocSignCol = "";
        this.PositionSignCol = "";
        this.RowVersion = "";
    }
}