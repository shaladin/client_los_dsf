export class PurchaseOrderDObj {
    PurchaseOrderDId: number;
    PurchaseOrderHId: number;
    MrPoItemCode: string;
    PurchaseOrderAmt: number;
    FeeName: string;
    RowVersion: string;

    constructor() {
        this.PurchaseOrderDId = 0;
        this.PurchaseOrderHId = 0;
        this.MrPoItemCode = "";
        this.PurchaseOrderAmt = 0;
        this.FeeName = "";
        this.RowVersion = "";
    }
}
