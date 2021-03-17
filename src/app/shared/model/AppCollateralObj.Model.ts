export class AppCollateralObj {
  Id: number;
  AppCollateralId: number;
  AppId: number;
  AppAssetId: number;
  AgrmntId: number;
  CollateralNo: string;
  CollateralSeqNo: number;
  FullAssetCode: string;
  FullAssetName: string;
  MrCollateralConditionCode: string;
  CollateralConditionName: string;
  MrCollateralUsageCode: string;
  CollateralUsageName: string;
  CollateralStat: string;
  SerialNo1: string;
  SerialNo2: string;
  SerialNo3: string;
  SerialNo4: string;
  SerialNo5: string;
  CollateralValueAmt: number;
  CollateralPrcnt: number;
  AssetTypeCode: string;
  AssetCategoryCode: string;
  CollateralNotes: string;
  ManufacturingYear: string;
  AppCollateralRegistrationId: number;
  OwnerName: string;
  IsMainCollateral: boolean;
  AssetTaxDt: Date;
  ListCollateralId: any[];
  RowVersion: string;
  RsvField1: string;
  RsvField2: string;
  RsvField3: string;
  RsvField4: string;
  RsvField5: string;
  InsAssetCoveredByDesc: string;

  constructor() {
    this.Id = 0;
    this.AppCollateralId = 0;
    this.AppId = 0;
    this.AppAssetId = 0;
    this.AgrmntId = 0;
    this.CollateralNo = "";
    this.CollateralSeqNo = 0;
    this.FullAssetCode = ""
    this.FullAssetName = ""
    this.MrCollateralConditionCode = "";
    this.MrCollateralUsageCode = "";
    this.CollateralStat = "";
    this.SerialNo1 = "";
    this.SerialNo2 = "";
    this.SerialNo3 = "";
    this.SerialNo4 = "";
    this.SerialNo5 = "";
    this.CollateralValueAmt = 0;
    this.AssetTypeCode = "";
    this.AssetCategoryCode = "";
    this.AssetTaxDt = new Date();
    this.CollateralNotes = "";
    this.CollateralPrcnt = 0;
    this.IsMainCollateral = false;
    this.ManufacturingYear = "";
    this.RsvField1 = "";
    this.RsvField2 = "";
    this.RsvField3 = "";
    this.RsvField4 = "";
    this.RsvField5 = "";
    this.RowVersion = "";
  }
}
