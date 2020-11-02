import { AppCustGrpObj } from "./AppCustGrpObj.Model";
import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";

export class ResponseAppCustCompletionPersonalDataObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustGrpObj: AppCustGrpObj;

    constructor()
    {
        this.AppCustObj = new AppCustObj();
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustGrpObj = new AppCustGrpObj()
    }
}