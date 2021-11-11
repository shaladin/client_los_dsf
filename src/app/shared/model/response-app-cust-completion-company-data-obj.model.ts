import { AppCustGrpObj } from "./app-cust-grp-obj.model";
import { AppCustObj } from "./app-cust-obj.model";
import { AppCustCompanyObj } from "./app-cust-company-obj.model";

export class ResponseAppCustCompletionCompanyDataObj {
    AppCustObj: AppCustObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustGrpObj: AppCustGrpObj;

    constructor()
    {
        this.AppCustObj = new AppCustObj();
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustGrpObj = new AppCustGrpObj()
    }
}