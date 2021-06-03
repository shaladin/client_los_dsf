export class AssetExpenseObj {
    AppAssetId: number;
    AssetName: string;
    AppAssetNo: string;
    InsuranceAtCost: number;
    MaintenanceAtCost: number;
    OtherExpense: number;
    Fee: number;
    TotalAssetExpense: number;

    constructor() {
        this.TotalAssetExpense = 0; 
    }
}