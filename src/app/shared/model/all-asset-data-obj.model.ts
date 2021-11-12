import { AppAssetObj } from "./app-asset-obj.model";
import { AppCollateralObj } from "./app-collateral-obj.model";
import { AppAssetSupplEmpObj } from "./app-asset-suppl-emp-obj.model";
import { AppCollateralRegistrationObj } from "./app-collateral-registration-obj.model";
import { AppCollateralAccessoryObj } from "./app-collateral-accessory-obj.model";
import { AppCollateralAttrObj, ReqAppCollateralAttrObj } from "./app-collateral-attr-obj.model";
import { AppAssetAttrObj, ReqAppAssetAttrObj } from "./app-asset-attr-obj.model";
import { AppAssetAccessoryObj } from "./app-asset-accessory-obj.model";
import { AppCollateralDocObj } from "./app-collateral-doc-obj.model";

export class AllAssetDataObj {
  AppAssetObj: AppAssetObj;
  AppAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  AppAssetSupplEmpAdminObj: AppAssetSupplEmpObj;
  AppAssetSupplEmpSalesObj: AppAssetSupplEmpObj;
  AppAssetSupplEmpManagerObj: AppAssetSupplEmpObj;
  AppCollateralObj: AppCollateralObj;
  AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  AppCollateralAccessoryObjs: Array<AppCollateralAccessoryObj>;
  AppCollateralAttrObj: Array<AppCollateralAttrObj>;
  AppAssetAttrObj: Array<AppAssetAttrObj>;
  ListAppCollateralDocObj: Array<AppCollateralDocObj>;
  LOBCode: string;
  IsAppAssetAccessoryChanged: boolean;
  VendorEmpId: number;
  BizTemplateCode: string;
  Copy: string;
  CopyNumber: number;
  RowVersion: string;

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
    this.ListAppCollateralDocObj= new Array<AppCollateralDocObj>();
    this.RowVersion = "";
    this.LOBCode = "";
    this.VendorEmpId = 0;
    this.BizTemplateCode = "";
    this.Copy = "No";
    this.CopyNumber = 0;
    this.IsAppAssetAccessoryChanged = false;
  }
}

export class ReqAssetDataObj {
  AppAssetObj: AppAssetObj;
  AppAssetAttrObj: Array<ReqAppAssetAttrObj>;
  AppCollateralDocObj: Array<AppCollateralDocObj>;
  AppCollateralAttrObj: Array<ReqAppCollateralAttrObj>;

  constructor() {
    this.AppAssetObj = new AppAssetObj();
    this.AppAssetAttrObj = new Array<ReqAppAssetAttrObj>();
    this.AppCollateralDocObj = new Array<AppCollateralDocObj>();
    this.AppCollateralAttrObj = new Array<ReqAppCollateralAttrObj>();
  }
}