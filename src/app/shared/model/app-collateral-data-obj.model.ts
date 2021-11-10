import { AppCollateralAttrObj } from "./app-collateral-attr-obj.model";
import { AppCollateralDocObj } from "./app-collateral-doc-obj.model";
import { AppCollateralObj } from "./app-collateral-obj.model";
import { AppCollateralRegistrationObj } from "./app-collateral-registration-obj.model";
import { ListAppCollateralDocObj } from "./list-app-collateral-doc-obj.model";

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