import { AppCollateralObj } from "./app-collateral-obj.model";
import { AppCollateralRegistrationObj } from "./app-collateral-registration-obj.model";
import { AppCollateralAttrObj } from "./app-collateral-attr-obj.model";
import { AppCollateralDocObj } from "./app-collateral-doc-obj.model";


export class AllCollateralDataObj {
  AppCollateralObj: AppCollateralObj;
  AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  AppCollateralAttrObj: Array<AppCollateralAttrObj>;
  ListAppCollateralDocObj: Array<AppCollateralDocObj>;
  RowVersion: string;

  constructor() {

    this.AppCollateralObj = new AppCollateralObj();
    this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
    this.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();
    this.ListAppCollateralDocObj= new Array<AppCollateralDocObj>();
    this.RowVersion = "";
  }
}
