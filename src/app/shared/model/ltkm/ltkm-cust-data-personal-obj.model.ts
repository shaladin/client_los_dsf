import { LtkmCustObj } from "./ltkm-cust-obj.model";
import { LtkmCustPersonalContactPersonObj } from "./ltkm-cust-personal-contact-person-obj.model";
import { LtkmCustPersonalFinDataObj } from "./ltkm-cust-personal-fin-data-obj.model";
import { LtkmCustPersonalJobDataObj } from "./ltkm-cust-personal-job-data-obj.model";
import { LtkmCustSocmedObj } from "./ltkm-cust-socmed-obj.model";
import { LtkmCustGrpObj } from "./ltkm-cust-grp-obj.model";
import { LtkmCustBankAccObj } from "./ltkm-cust-bank-acc-obj.model";
import { LtkmCustPersonalObj } from "./ltkm-cust-personal-obj.model";
import { LtkmCustAddrObj } from "./ltkm-cust-addr-obj.model";
import { LtkmCustAssetObj } from "./ltkm-cust-asset-obj.model";
import { LtkmCustOtherInfoObj } from "./ltkm-cust-other-info-obj.model";
import { LtkmAttrContent } from "./ltkm-attr-content.model";
import { LtkmCustEmrgncCntctObj } from "./ltkm-cust-emrgnc-cntct-obj.model";
import { LtkmReqObj } from "./ltkm-req-obj.model";

export class LtkmCustDataPersonalObj {
    LtkmCustObj: LtkmCustObj;
    LtkmCustPersonalObj: LtkmCustPersonalObj;
    LtkmCustAddrLegalObj: LtkmCustAddrObj;
    LtkmCustAddrResidenceObj: LtkmCustAddrObj;
    LtkmCustAddrMailingObj: LtkmCustAddrObj;
    LtkmCustPersonalContactPersonObjs: Array<LtkmCustPersonalContactPersonObj>;
    LtkmCustPersonalFinDataObj: Array<LtkmCustPersonalFinDataObj>;
    LtkmCustBankAccObjs: Array<LtkmCustBankAccObj>;
    LtkmCustPersonalJobDataObj: LtkmCustPersonalJobDataObj;
    LtkmCustSocmedObjs: Array<LtkmCustSocmedObj>;
    LtkmCustGrpObjs: Array<LtkmCustGrpObj>;
    LtkmCustAssetList: Array<LtkmCustAssetObj>;
    LtkmCustEmergencyContact: LtkmCustEmrgncCntctObj;
    LtkmReq: LtkmReqObj;

    LtkmCustOtherInfoObj: LtkmCustOtherInfoObj;

    LtkmCustAttrContent: Array<any>;

    listFamily : Array<LtkmCustObj>;
    RowVersion: string;

    constructor() { 
        this.LtkmCustObj = new LtkmCustObj(); 
        this.LtkmCustPersonalObj = new LtkmCustPersonalObj();
        this.LtkmCustAddrLegalObj = new LtkmCustAddrObj();
        this.LtkmCustAddrResidenceObj = new LtkmCustAddrObj();
        this.LtkmCustAddrMailingObj = new LtkmCustAddrObj();
        this.LtkmCustPersonalFinDataObj = new Array<LtkmCustPersonalFinDataObj>();
        this.LtkmCustPersonalJobDataObj = new LtkmCustPersonalJobDataObj();
        this.LtkmCustSocmedObjs = new Array<LtkmCustSocmedObj>();
        this.LtkmCustGrpObjs = new Array<LtkmCustGrpObj>();
        this.LtkmCustBankAccObjs = new Array<LtkmCustBankAccObj>();
        this.LtkmCustPersonalContactPersonObjs = new Array<LtkmCustPersonalContactPersonObj>();
        this.LtkmCustAssetList = new Array<LtkmCustAssetObj>();
        this.LtkmReq = new LtkmReqObj();
        
        this.LtkmCustOtherInfoObj = new LtkmCustOtherInfoObj();

        this.LtkmCustAttrContent = new Array();
        this.LtkmCustEmergencyContact = new LtkmCustEmrgncCntctObj();

        this.listFamily = new Array<LtkmCustObj>();
        this.RowVersion = ""; 
    }
}
