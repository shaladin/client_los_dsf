import { AppCustObj } from "./app-cust-obj.model";
import { AppCustCompanyObj } from "./app-cust-company-obj.model";
import { AppCustAddrObj } from "./app-cust-addr-obj.model";
import { AppCustCompanyFinDataObj } from "./app-cust-company-fin-data-obj.model";
import { AppCustGrpObj } from "./app-cust-grp-obj.model";
import { AppCustCompanyMgmntShrholderObj } from "./app-cust-company-mgmnt-shrholder-obj.model";
import { AppCustCompanyContactPersonObj } from "./app-cust-company-contact-person-obj.model";
import { AppCustBankAccObj } from "./app-cust-bank-acc-obj.model";
import { AppCustCompanyLegalDocObj } from "./app-cust-company-legal-doc-obj.model";
import { AppCustAssetObj } from "./app-cust-asset/app-cust-asset-obj.model";



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
    AppCustAssetList: Array<AppCustAssetObj>;
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
