import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";
import { AppCollateralAttrObj } from "./AppCollateralAttrObj.Model";
import { AppCollateralDocObj } from "./AppCollateralDocObj.Model";


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
