import { AppAssetAccessoryObj } from "app/shared/model/app-asset-accessory-obj.model";

export class AssetAccObj {
    FullAssetName: string;
    AssetPriceAmt: number;
    TotalAssetInclAcc: number;
    TotalDPInclAcc: number;
    DownPaymentPrcnt: number;
    InsuranceType: string; 
    IsDoubleFinancing: boolean;
    ManufacturingYear: number; 
    AssetCondition: string;
    listAcc: Array<AppAssetAccessoryObj>;
    
      constructor() {
      this.FullAssetName = "";
      this.AssetPriceAmt = 0;
      this.TotalAssetInclAcc = 0;
      this.TotalDPInclAcc = 0;
      this.ManufacturingYear = 0;
    }
}