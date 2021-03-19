import { CustObj } from "./CustObj.Model";
import { CustPersonalObj } from "./CustPersonalObj.Model";
import { CustAddrObj } from "./CustAddrObj.Model";
import { AppCustCompanyMgmntShrholderObj } from "./AppCustCompanyMgmntShrholderObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { CustPersonalFinDataObj } from "./CustPersonalFinDataObj.Model";
import { AppCustBankAccObj } from "./AppCustBankAccObj.Model";
import { AppCustPersonalJobDataObj } from "./AppCustPersonalJobDataObj.Model";
import { AppCustGrpObj } from "./AppCustGrpObj.Model";
import { AppCustOtherInfoObj } from "./AppCustOtherInfoObj.model";
import { ResponseListCustAttrContentObj } from "./ResponseListCustAttrContentObj.Model";
import { CustPersonalContactPersonObj } from "./CustPersonalContactPersonObj.Model";

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