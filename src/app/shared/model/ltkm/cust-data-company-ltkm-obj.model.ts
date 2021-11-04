import { LtkmAttrContent } from "./ltkm-attr-content.model";
import { LtkmCustAddrObj } from "./ltkm-cust-addr-obj.model";
import { LtkmCustAssetObj } from "./ltkm-cust-asset-obj.model";
import { LtkmCustBankAccObj } from "./ltkm-cust-bank-acc-obj.model";
import { LtkmCustCompanyContactPersonObj } from "./ltkm-cust-company-contact-person-obj.model";
import { LtkmCustCompanyFinDataObj } from "./ltkm-cust-company-fin-data-obj.model";
import { LtkmCustCompanyLegalDocObj } from "./ltkm-cust-company-legal-doc-obj.model";
import { LtkmCustCompanyMgmntShrholderObj } from "./ltkm-cust-company-mgmnt-shrholder-obj.model";
import { LtkmCustCompanyObj } from "./ltkm-cust-company-obj.model";
import { LtkmCustGrpObj } from "./ltkm-cust-grp-obj.model";
import { LtkmCustObj } from "./ltkm-cust-obj.model";
import { LtkmCustOtherInfoObj } from "./ltkm-cust-other-info-obj.model";

export class CustDataCompanyLtkmObj {
    LtkmCustObj: LtkmCustObj;
    LtkmCustCompanyObj: LtkmCustCompanyObj;
    LtkmCustAddrLegalObj: LtkmCustAddrObj;
    LtkmCustAddrMailingObj: LtkmCustAddrObj;
    LtkmCustCompanyMgmntShrholderObjs: Array<LtkmCustCompanyMgmntShrholderObj>;
    LtkmCustCompanyContactPersonObj: LtkmCustCompanyContactPersonObj;
    LtkmCustCompanyFinDataObjs: Array<LtkmCustCompanyFinDataObj>;
    LtkmCustBankAccObjs: Array<LtkmCustBankAccObj>;
    LtkmCustCompanyLegalDocObjs: Array<LtkmCustCompanyLegalDocObj>;
    LtkmCustGrpObjs: Array<LtkmCustGrpObj>;
    LtkmCustAssetList: Array<LtkmCustAssetObj>;

    LtkmCustOtherInfoObj: LtkmCustOtherInfoObj;
    LtkmCustAttrContent: Array<any>;
    RowVersion: string;

    constructor() {
        this.LtkmCustObj = new LtkmCustObj();
        this.LtkmCustCompanyObj = new LtkmCustCompanyObj();
        this.LtkmCustAddrLegalObj = new LtkmCustAddrObj();
        this.LtkmCustAddrMailingObj = new LtkmCustAddrObj();
        this.LtkmCustCompanyFinDataObjs = new Array<LtkmCustCompanyFinDataObj>();
        this.LtkmCustCompanyMgmntShrholderObjs = new Array<LtkmCustCompanyMgmntShrholderObj>();
        this.LtkmCustCompanyContactPersonObj = new LtkmCustCompanyContactPersonObj();
        this.LtkmCustBankAccObjs = Array<LtkmCustBankAccObj>();
        this.LtkmCustCompanyLegalDocObjs = Array<LtkmCustCompanyLegalDocObj>();
        this.LtkmCustGrpObjs = Array<LtkmCustGrpObj>();
        this.LtkmCustAssetList = new Array<LtkmCustAssetObj>();

        this.LtkmCustOtherInfoObj = new LtkmCustOtherInfoObj();
        this.LtkmCustAttrContent = new Array();
        this.RowVersion = "";
    }
}
