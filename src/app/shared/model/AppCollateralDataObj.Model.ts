import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";

export class AppCollateralDataObj{
    AppCollateralObj: AppCollateralObj;
    AppCollateralRegistrationObj: AppCollateralRegistrationObj;
    AppCollateralAttrObj: any;
    RowVersion: any;

    constructor() { 
        this.AppCollateralObj = new AppCollateralObj(); 
        this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
        this.AppCollateralAttrObj = new Array();
        this.RowVersion = ""; 
    }
}