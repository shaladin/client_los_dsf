export class ReqAppCollateralForCopyInsuranceCustomObj {
    AppId: number;
    FullAssetCode: string; 
    ManufacturingYear: string;
    MrCollateralConditionCode: string;
    MrCollateralUsageCode: string;
    CollateralValueAmt: number;
    TotalAccessoryPriceAmt: number;

    constructor() { 
        this.AppId = 0;
        this.FullAssetCode = "";
        this.ManufacturingYear = "";
        this.MrCollateralConditionCode = "";
        this.MrCollateralUsageCode = "";
        this.CollateralValueAmt = 0;
        this.TotalAccessoryPriceAmt = 0;
    }
}