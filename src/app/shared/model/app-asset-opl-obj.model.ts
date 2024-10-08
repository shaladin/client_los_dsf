import { AppAssetAccessoryObj } from "./app-asset-accessory-obj.model";

export class AppAssetOplObj {
    Id: number;
    AppAssetId: number;
    AppId: number;
    AgrmntId: number;
    AssetSeqNo: number;
    FullAssetCode: string;
    FullAssetName: string;
    MrAssetConditionCode: string;
    MrAssetConditionName: string;
    DiscountAmt: number;
    MrAssetConditionCodeDesc: string;
    MrAssetUsageCode: string;
    MrAssetUsageCodeDesc: string;
    AssetStat: string;
    SerialNo1: string;
    SerialNo2: string;
    SerialNo3: string;
    SerialNo4: string;
    SerialNo5: string;
    AssetPriceAmt: number;
    DownPaymentAmt: number;
    DownPaymentPrcnt: number;
    MinDownPaymentPrcnt: number;
    MaxDownPaymentPrcnt: number;
    AssetTypeCode: string;
    AssetCategoryCode: string;
    AssetTaxDt: Date;
    SupplCode: string;
    SupplName: string;
    IsCollateral: boolean;
    IsInsurance: boolean;
    AssetNotes: string;
    TempRegisLettNo: string;
    TempRegisLettDt: Date;
    Color: string;
    TaxCityIssuer: string;
    TaxIssueDt: Date;
    ManufacturingYear: number;
    IsEditableDp: boolean;
    RsvField1: string;
    RsvField2: string;
    RsvField3: string;
    RsvField4: string;
    RsvField5: string;
    InsAssetCoveredByDesc: string;
    AppAssetNo: string;
    Discount: number;
    ExpectedDelivDt: Date;
    IsNeedReplacementCar: boolean;
    BizTemplateCode: string;
    count: number;
    AssetPriceBefDiscAmt: number;
    RowVersion: string;
  
    SerialNo1Label: string;
    SerialNo2Label: string;
    SerialNo3Label: string;
    SerialNo4Label: string;
    SerialNo5Label: string;

    AssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  
      constructor() {
      this.Id = 0;
      this.AppAssetId = 0;
      this.AppId = 0;
      this.AgrmntId = 0;
      this.AssetSeqNo = 0;
      this.FullAssetCode = ""
      this.FullAssetName = ""
      this.MrAssetConditionCode = "";
      this.MrAssetConditionName = "";
      this.DiscountAmt= 0;
      this.MrAssetUsageCode = "";
      this.AssetStat = "";
      this.SerialNo1 = "";
      this.SerialNo2 = "";
      this.SerialNo3 = "";
      this.SerialNo4 = "";
      this.SerialNo5 = "";
      this.AssetPriceAmt = 0;
      this.DownPaymentAmt = 0;
      this.AssetTypeCode = "";
      this.AssetCategoryCode = "";
      this.SupplCode = "";
      this.SupplName = "";
      this.IsCollateral = false;
      this.IsInsurance = false;
      this.AssetNotes = "";
      this.TempRegisLettNo = "";
      this.Color = "";
      this.TaxCityIssuer = "";
      this.ManufacturingYear = 0;
      this.IsEditableDp = false;
      this.RsvField1 = "";
      this.RsvField2 = "";
      this.RsvField3 = "";
      this.RsvField4 = "";
      this.RsvField5 = "";
      this.Discount = 0;
      this.ExpectedDelivDt = new Date();
      this.IsNeedReplacementCar = false;
      this.BizTemplateCode = "";
      this.count = 0;
      this.AssetPriceBefDiscAmt = 0;
      this.RowVersion = "";
    }
  }
  