import { AppCollateralAttrObj } from "./AppCollateralAttrObj.Model";
import { AppCollateralDocObj } from "./AppCollateralDocObj.Model";
import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";
import { ListAppCollateralDocObj } from "./ListAppCollateralDocObj.Model";

export class AppCollateralDataObj{
    AppCollateralObj: AppCollateralObj;
    AppCollateralRegistrationObj: AppCollateralRegistrationObj;
    AppCollateralAttrObj: Array<AppCollateralAttrObj>;
    RowVersion: string;
    ListAppCollateralDocObj: Array<AppCollateralDocObj>;
    BizTemplateCode: string;

    constructor() { 
        this.AppCollateralObj = new AppCollateralObj(); 
        this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
        this.AppCollateralAttrObj = new Array<AppCollateralAttrObj>();
        this.ListAppCollateralDocObj= new Array<AppCollateralDocObj>();
        this.BizTemplateCode = "";
        this.RowVersion = ""; 
    }
}