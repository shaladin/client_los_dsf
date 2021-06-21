import { AppInsMainCvgObj } from "./AppInsMainCvgObj.Model";
import { AppInsObjObj } from "./AppInsObjObj.Model";
import { AppInsuranceObj } from "./AppInsuranceObj.Model";

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