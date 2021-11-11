import { AppCustGrpObj } from "./app-cust-grp-obj.model";
import { AppCustObj } from "./app-cust-obj.model";
import { AppCustPersonalObj } from "./app-cust-personal-obj.model";

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