import { AppCustObj } from "./app-cust-obj.model";
import { AppCustPersonalObj } from "./app-cust-personal-obj.model";
import { AppCustAddrObj } from "./app-cust-addr-obj.model";
import { AppCustPersonalContactPersonObj } from "./app-cust-personal-contact-person-obj.model";
import { AppCustPersonalFinDataObj } from "./app-cust-personal-fin-data-obj.model";
import { AppCustPersonalJobDataObj } from "./app-cust-personal-job-data-obj.model";
import { AppCustSocmedObj } from "./app-cust-socmed-obj.model";
import { AppCustGrpObj } from "./app-cust-grp-obj.model";
import { AppCustBankAccObj } from "./app-cust-bank-acc-obj.model";
import { AppCustAssetObj } from "./app-cust-asset/app-cust-asset-obj.model";


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
    AppCustAssetList: Array<AppCustAssetObj>;
    RowVersion: string;

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
