export class AppAssetAccessoryObj {
  AppAssetAccessoryId: number;
  AppAssetId: number;
  AssetAccessoryCode: string;
  AssetAccessoryName: string;
  SupplCode: string;
  SupplName: string;
  AccessoryPriceAmt: number;
  DownPaymentAmt: number;
  AccessoryNotes: string;
  RowVersion: string;

  constructor() {
    this.AppAssetAccessoryId = 0;
    this.AppAssetId = 0;
    this.AssetAccessoryCode = "";
    this.AssetAccessoryName = "";
    this.SupplCode = "";
    this.SupplName = "";
    this.AccessoryPriceAmt = 0;
    this.DownPaymentAmt = 0;
    this.AccessoryNotes = "";
    this.RowVersion = "";
  }
}
