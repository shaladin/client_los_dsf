import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustPersonalContactPersonObj } from "./AppCustPersonalContactPersonObj.Model";
import { AppCustPersonalFinDataObj } from "./AppCustPersonalFinDataObj.Model";
import { AppCustPersonalJobDataObj } from "./AppCustPersonalJobDataObj.Model";
import { AppCustSocmedObj } from "./AppCustSocmedObj.Model";


export class CustDataPersonalObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustAddrResidenceObj: AppCustAddrObj;
    AppCustAddrMailingObj: AppCustAddrObj;
    AppCustPersonalContactPersonObjs: any;
    AppCustPersonalFinDataObj: AppCustPersonalFinDataObj;
    AppCustBankAccObjs: any;
    AppCustPersonalJobDataObj: AppCustPersonalJobDataObj;
    AppCustSocmedObjs: any;
    AppCustGrpObjs: any;
    RowVersion: any;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustAddrResidenceObj = new AppCustAddrObj();
        this.AppCustAddrMailingObj = new AppCustAddrObj();
        this.AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
        this.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.RowVersion = ""; 
    }
}
