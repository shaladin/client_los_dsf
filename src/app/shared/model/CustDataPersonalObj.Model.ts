import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustPersonalContactPersonObj } from "./AppCustPersonalContactPersonObj.Model";
import { AppCustPersonalFinDataObj } from "./AppCustPersonalFinDataObj.Model";
import { AppCustPersonalJobDataObj } from "./AppCustPersonalJobDataObj.Model";
import { AppCustSocmedObj } from "./AppCustSocmedObj.Model";
import { AppCustGrpObj } from "./AppCustGrpObj.Model";
import { AppCustBankAccObj } from "./AppCustBankAccObj.Model";


export class CustDataPersonalObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustAddrResidenceObj: AppCustAddrObj;
    AppCustAddrMailingObj: AppCustAddrObj;
    AppCustPersonalContactPersonObjs: Array<AppCustPersonalContactPersonObj>;
    AppCustPersonalFinDataObj: AppCustPersonalFinDataObj;
    AppCustBankAccObjs: Array<AppCustBankAccObj>;
    AppCustPersonalJobDataObj: AppCustPersonalJobDataObj;
    AppCustSocmedObjs: Array<AppCustSocmedObj>;
    AppCustGrpObjs: Array<AppCustGrpObj>;
    RowVersion: any;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustAddrResidenceObj = new AppCustAddrObj();
        this.AppCustAddrMailingObj = new AppCustAddrObj();
        this.AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
        this.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.AppCustSocmedObjs = new Array<AppCustSocmedObj>();
        this.AppCustGrpObjs = new Array<AppCustGrpObj>();
        this.AppCustBankAccObjs = new Array<AppCustBankAccObj>();
        this.AppCustPersonalContactPersonObjs = new Array<AppCustPersonalContactPersonObj>();

        this.RowVersion = ""; 
    }
}
