import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";
import { AppCollateralAttrObj } from "./AppCollateralAttrObj.Model";


export class AllCollateralDataObj {
  AppCollateralObj: AppCollateralObj;
  AppCollateralRegistrationObj: AppCollateralRegistrationObj;
  AppCollateralAttrObj: any;
  RowVersion: any;

  constructor() {

    this.AppCollateralObj = new AppCollateralObj();
    this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();

    this.RowVersion = "";
  }
}
