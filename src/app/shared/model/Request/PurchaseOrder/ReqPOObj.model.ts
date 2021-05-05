export class ReqGetPurchaseOrderHDetailObj{
    PurchaseOrderHId: number;
    AgrmntId: number;
    SupplCode: string;
    RowVersion: string;
    constructor(){  
        this.PurchaseOrderHId = 0;
        this.AgrmntId = 0;
        this.SupplCode = "";
        this.RowVersion = "";
    }
}