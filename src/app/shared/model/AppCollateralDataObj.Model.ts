import { AppCollateralObj } from "./AppCollateralObj.Model";
import { AppCollateralRegistrationObj } from "./AppCollateralRegistrationObj.Model";
import { ListAppCollateralDocObj } from "./ListAppCollateralDocObj.Model";

export class AppCollateralDataObj{
    AppCollateralObj: AppCollateralObj;
    AppCollateralRegistrationObj: AppCollateralRegistrationObj;
    AppCollateralAttrObj: any;
    RowVersion: any;
    ListAppCollateralDocObj:any;
    BizTemplateCode: string;

    constructor() { 
        this.AppCollateralObj = new AppCollateralObj(); 
        this.AppCollateralRegistrationObj = new AppCollateralRegistrationObj();
        this.AppCollateralAttrObj = new Array();
        this.ListAppCollateralDocObj= new Array();
        this.BizTemplateCode = "";
        this.RowVersion = ""; 
    }
}