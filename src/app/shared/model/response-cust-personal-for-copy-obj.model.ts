import { CustObj } from "./cust-obj.model";
import { CustPersonalObj } from "./cust-personal-obj.model";
import { CustAddrObj } from "./cust-addr-obj.model";
import { AppCustCompanyMgmntShrholderObj } from "./app-cust-company-mgmnt-shrholder-obj.model";
import { AppCustAddrObj } from "./app-cust-addr-obj.model";
import { CustPersonalFinDataObj } from "./cust-personal-fin-data-obj.model";
import { AppCustBankAccObj } from "./app-cust-bank-acc-obj.model";
import { AppCustPersonalJobDataObj } from "./app-cust-personal-job-data-obj.model";
import { AppCustGrpObj } from "./app-cust-grp-obj.model";
import { AppCustOtherInfoObj } from "./app-cust-other-info-obj.model";
import { ResponseListCustAttrContentObj } from "./response-list-cust-attr-content-obj.model";
import { CustPersonalContactPersonObj } from "./cust-personal-contact-person-obj.model";

export class ResponseCustPersonalForCopyObj {
    CustObj: CustObj;
    CustPersonalObj: CustPersonalObj;
    CustAddrObjs: Array<AppCustAddrObj>;
    CustAddrLegalObj : CustAddrObj;
    CustPersonalFinDataObj: CustPersonalFinDataObj;
    CustBankAccObjs: Array<AppCustBankAccObj>;
    CustGrpObjs: Array<AppCustGrpObj>;
    CustPersonalJobDataObj: AppCustPersonalJobDataObj;
    CustOtherInfoObj: AppCustOtherInfoObj;
    CustAttrContentObjs: ResponseListCustAttrContentObj;
    CustPersonalEmergencyContactObj: CustPersonalContactPersonObj;
    CustCompanyMgmntShrholderObj: AppCustCompanyMgmntShrholderObj;

    constructor()
    {
        this.CustObj = new CustObj();
        this.CustPersonalObj = new CustPersonalObj();
        this.CustAddrObjs = new Array<AppCustAddrObj>();
        this.CustAddrLegalObj = new CustAddrObj ();
        this.CustPersonalFinDataObj = new CustPersonalFinDataObj();
        this.CustBankAccObjs = new Array<AppCustBankAccObj>();
        this.CustGrpObjs = new Array<AppCustGrpObj>();
        this.CustPersonalJobDataObj = new AppCustPersonalJobDataObj();
        this.CustOtherInfoObj = new AppCustOtherInfoObj();
        this.CustAttrContentObjs = new ResponseListCustAttrContentObj();
        this.CustPersonalEmergencyContactObj = new CustPersonalContactPersonObj();
        this.CustCompanyMgmntShrholderObj = new AppCustCompanyMgmntShrholderObj();
    }
}