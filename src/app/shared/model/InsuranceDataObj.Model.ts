import { AppInsuranceObj } from "./AppInsuranceObj.Model";
import { AppInsObjObj } from "./AppInsObjObj.Model";

export class InsuranceDataObj {
    AppId: number;
    AppInsuranceObj: AppInsuranceObj;
    AppInsObjObj: AppInsObjObj;
    RowVersion: string;

    constructor() {
        this.AppId = 0;
        this.AppInsuranceObj = new AppInsuranceObj();
        this.AppInsObjObj = new AppInsObjObj(); 
        this.RowVersion = ""; 
    }
}
