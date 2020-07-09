import { AppAssetObj } from "./AppAssetObj.Model";
import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppAssetSupplEmpObj } from "./AppAssetSupplEmpObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";
import { AppCustPersonalFinDataObj } from "./AppCustPersonalFinDataObj.Model";
import { AppCollateralAccessoryObj } from "./AppCollateralAccessoryObj.Model";
import { AppCollateralAttrObj } from "./AppCollateralAttrObj.Model";


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
  LOBCode: string;
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
    this.RowVersion = "";
    this.LOBCode = "";
  }
}
