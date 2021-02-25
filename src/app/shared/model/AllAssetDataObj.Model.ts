import { AppAssetObj } from "./AppAssetObj.Model";
import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppAssetSupplEmpObj } from "./AppAssetSupplEmpObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";
import { AppCollateralAccessoryObj } from "./AppCollateralAccessoryObj.Model";
import { AppCollateralAttrObj } from "./AppCollateralAttrObj.Model";
import { AppAssetAttrObj } from "./AppAssetAttrObj.Model";


export class AllAssetDataObj {
  AppAssetObj: AppAssetObj;
  AppAssetAccessoryObjs: any;
  AppAssetSupplEmpAdminObj: AppAssetSupplEmpObj;
  AppAssetSupplEmpSalesObj: AppAssetSupplEmpObj;
  AppAssetSupplEmpManagerObj: AppAssetSupplEmpObj;
  AppCollateralObj: AppCollateralObj;
  AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  AppCollateralAccessoryObjs: Array<AppCollateralAccessoryObj>;
  AppCollateralAttrObj: Array<AppCollateralAttrObj>;
  AppAssetAttrObj: Array<AppAssetAttrObj>;
  LOBCode: string;
  IsAppAssetAccessoryChanged: boolean;
  VendorEmpId: number;
  BizTemplateCode: string;
  Copy: string;
  CopyNumber: number;
  RowVersion: any;

  constructor() {
    this.AppAssetObj = new AppAssetObj();
    this.AppAssetSupplEmpAdminObj = new AppAssetSupplEmpObj();
    this.AppAssetSupplEmpSalesObj = new AppAssetSupplEmpObj();
    this.AppAssetSupplEmpManagerObj = new AppAssetSupplEmpObj();
    this.AppCollateralObj = new AppCollateralObj();
    this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
    this.AppCollateralAccessoryObjs = new Array<AppCollateralAccessoryObj>();
    this.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();
    this.AppAssetAttrObj = new Array<AppAssetAttrObj>();
    this.RowVersion = "";
    this.LOBCode = "";
    this.VendorEmpId = 0;
    this.BizTemplateCode = "";
    this.Copy = "No";
    this.CopyNumber = 0;
    this.IsAppAssetAccessoryChanged = false;
  }
}