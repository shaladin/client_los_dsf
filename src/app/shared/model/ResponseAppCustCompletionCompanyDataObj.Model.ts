import { AppCustGrpObj } from "./AppCustGrpObj.Model";
import { AppCustObj } from "./AppCustObj.Model";
import { AppCustCompanyObj } from "./AppCustCompanyObj.Model";

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