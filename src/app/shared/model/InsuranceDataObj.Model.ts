import { AppInsuranceObj } from "./AppInsuranceObj.Model";
import { AppInsObjObj } from "./AppInsObjObj.Model";
import { AppInsMainCvgObj } from "./AppInsMainCvgObj.Model";

export class InsuranceDataObj {
    AppId: number;
    AppInsuranceObj: AppInsuranceObj;
    AppInsObjObj: AppInsObjObj;
    AppInsMainCvgObjs: Array<AppInsMainCvgObj>;
    DefaultInsAssetRegion: string;
    RowVersion: string;

    constructor() {
        this.AppId = 0;
        this.AppInsuranceObj = new AppInsuranceObj();
        this.AppInsObjObj = new AppInsObjObj(); 
        this.AppInsMainCvgObjs = new Array<AppInsMainCvgObj>();
        this.RowVersion = ""; 
    }
}
