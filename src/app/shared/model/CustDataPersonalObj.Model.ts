import { AppCustObj } from "./AppCustObj.Model";
import { AppCustPersonalObj } from "./AppCustPersonalObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustPersonalContactPersonObj } from "./AppCustPersonalContactPersonObj.Model";
import { AppCustPersonalFinDataObj } from "./AppCustPersonalFinDataObj.Model";


export class CustDataPersonalObj {
    AppCustObj: AppCustObj;
    AppCustPersonalObj: AppCustPersonalObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustAddrResidenceObj: AppCustAddrObj;
    AppCustAddrMailingObj: AppCustAddrObj;
    AppCustPersonalContactPersonObjs: any;
    AppCustPersonalFinDataObj: AppCustPersonalFinDataObj;
    AppCustBankAccObjs: any;
    RowVersion: any;

    constructor() { 
        this.AppCustObj = new AppCustObj(); 
        this.AppCustPersonalObj = new AppCustPersonalObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustAddrResidenceObj = new AppCustAddrObj();
        this.AppCustAddrMailingObj = new AppCustAddrObj();
        this.AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
        this.RowVersion = ""; 
    }
}
