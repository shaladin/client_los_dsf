import { AppCustObj } from "./AppCustObj.Model";
import { AppCustCompanyObj } from "./AppCustCompanyObj.Model";
import { AppCustAddrObj } from "./AppCustAddrObj.Model";
import { AppCustCompanyFinDataObj } from "./AppCustCompanyFinDataObj.Model";
import { AppCustGrpObj } from "./AppCustGrpObj.Model";
import { AppCustCompanyMgmntShrholderObj } from "./AppCustCompanyMgmntShrholderObj.Model";
import { AppCustCompanyContactPersonObj } from "./AppCustCompanyContactPersonObj.Model";
import { AppCustBankAccObj } from "./AppCustBankAccObj.Model";
import { AppCustCompanyLegalDocObj } from "./AppCustCompanyLegalDocObj.Model";



export class CustDataCompanyObj {
    AppCustObj: AppCustObj;
    AppCustCompanyObj: AppCustCompanyObj;
    AppCustAddrLegalObj: AppCustAddrObj;
    AppCustAddrMailingObj: AppCustAddrObj;
    AppCustCompanyMgmntShrholderObjs: Array<AppCustCompanyMgmntShrholderObj>;
    AppCustCompanyContactPersonObjs: Array<AppCustCompanyContactPersonObj>;
    AppCustCompanyFinDataObj: AppCustCompanyFinDataObj;
    AppCustBankAccObjs: Array<AppCustBankAccObj>;
    AppCustCompanyLegalDocObjs: Array<AppCustCompanyLegalDocObj>;
    AppCustGrpObjs: Array<AppCustGrpObj>;
    RowVersion: string;

    constructor() { 
        this.AppCustObj = new AppCustObj();
        this.AppCustCompanyObj = new AppCustCompanyObj();
        this.AppCustAddrLegalObj = new AppCustAddrObj();
        this.AppCustAddrMailingObj = new AppCustAddrObj();
        this.AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
        this.AppCustCompanyMgmntShrholderObjs = new Array<AppCustCompanyMgmntShrholderObj>();
        this.AppCustCompanyContactPersonObjs = new Array<AppCustCompanyContactPersonObj>();
        this.AppCustBankAccObjs = Array<AppCustBankAccObj>();
        this.AppCustCompanyLegalDocObjs = Array<AppCustCompanyLegalDocObj>();
        this.AppCustGrpObjs = Array<AppCustGrpObj>();
        this.RowVersion = ""; 
    }
}
