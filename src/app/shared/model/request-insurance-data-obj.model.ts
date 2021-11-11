import { AppInsMainCvgObj } from "./app-ins-main-cvg-obj.model";
import { AppInsObjObj } from "./app-ins-obj-obj.model";
import { AppInsuranceObj } from "./app-insurance-obj.model";

export class RequestInsuranceDataObj {
    AppInsuranceObj: AppInsuranceObj;
    AppInsObjObj: AppInsObjObj;
    AppInsMainCvgObjs: Array<AppInsMainCvgObj>;
    AppId: number;
    AppAssetId : number;

    constructor()
    {
        this.AppInsuranceObj = new AppInsuranceObj;
        this.AppInsObjObj = new AppInsObjObj();
        this.AppId = 0;
        this.AppAssetId = 0;
    }
}