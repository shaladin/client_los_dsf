import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";


export class AllCollateralDataObj {
  AppCollateralObj: AppCollateralObj;
    AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  AppCollateralAttrObj: AppCollateralAttrObj
  RowVersion: any;

  constructor() {

    this.AppCollateralObj = new AppCollateralObj();
    this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
    this.RowVersion = "";
  }
}
