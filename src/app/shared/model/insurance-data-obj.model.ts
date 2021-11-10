import { AppInsuranceObj } from "./app-insurance-obj.model";
import { AppInsObjObj } from "./app-ins-obj-obj.model";
import { AppInsMainCvgObj } from "./app-ins-main-cvg-obj.model";

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
