import { LtkmAttrContent } from "./LtkmAttrContent.Model";
import { LtkmCustAddrObj } from "./LtkmCustAddrObj.Model";
import { LtkmCustAssetObj } from "./LtkmCustAssetObj.Model";
import { LtkmCustBankAccObj } from "./LtkmCustBankAccObj.Model";
import { LtkmCustCompanyContactPersonObj } from "./LtkmCustCompanyContactPersonObj.Model";
import { LtkmCustCompanyFinDataObj } from "./LtkmCustCompanyFinDataObj.Model";
import { LtkmCustCompanyLegalDocObj } from "./LtkmCustCompanyLegalDocObj.Model";
import { LtkmCustCompanyMgmntShrholderObj } from "./LtkmCustCompanyMgmntShrholderObj.Model";
import { LtkmCustCompanyObj } from "./LtkmCustCompanyObj.Model";
import { LtkmCustGrpObj } from "./LtkmCustGrpObj.Model";
import { LtkmCustObj } from "./LtkmCustObj.Model";
import { LtkmCustOtherInfoObj } from "./LtkmCustOtherInfoObj.Model";

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
