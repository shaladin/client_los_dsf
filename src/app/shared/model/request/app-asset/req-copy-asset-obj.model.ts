export class ReqCopyAssetObj {
    AppId: number;
    Code: string;
    count: number;
    FullAssetCode: string; 
    ManufacturingYear: string;
    Color: string;
    MrAssetConditionCode: string;
    AssetPriceAmt: number;
    MrAssetUsageCode:string; 
    TotalAccessoryPriceAmt: number;

    constructor() { 
        this.AppId = 0;
        this.Code = "";
        this.count = 0;
        this.FullAssetCode = "";
        this.ManufacturingYear = "";
        this.Color = "";
        this.MrAssetConditionCode = "";
        this.AssetPriceAmt = 0;
        this.MrAssetUsageCode = "";
        this.TotalAccessoryPriceAmt = 0;
    }
}