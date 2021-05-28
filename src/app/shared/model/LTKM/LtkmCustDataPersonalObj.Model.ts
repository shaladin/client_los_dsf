import { LtkmCustObj } from "./LtkmCustObj.Model";
import { LtkmCustPersonalContactPersonObj } from "./LtkmCustPersonalContactPersonObj.Model";
import { LtkmCustPersonalFinDataObj } from "./LtkmCustPersonalFinDataObj.Model";
import { LtkmCustPersonalJobDataObj } from "./LtkmCustPersonalJobDataObj.Model";
import { LtkmCustSocmedObj } from "./LtkmCustSocmedObj.Model";
import { LtkmCustGrpObj } from "./LtkmCustGrpObj.Model";
import { LtkmCustBankAccObj } from "./LtkmCustBankAccObj.Model";
import { LtkmCustPersonalObj } from "./LtkmCustPersonalObj.Model";
import { LtkmCustAddrObj } from "./LtkmCustAddrObj.Model";
import { LtkmCustAssetObj } from "./LtkmCustAssetObj.Model";
import { LtkmCustOtherInfoObj } from "./LtkmCustOtherInfoObj.Model";
import { LtkmAttrContent } from "./LtkmAttrContent.Model";
import { LtkmCustEmrgncCntctObj } from "./LtkmCustEmrgncCntctObj.Model";


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
        
        this.LtkmCustOtherInfoObj = new LtkmCustOtherInfoObj();

        this.LtkmCustAttrContent = new Array();
        this.LtkmCustEmergencyContact = new LtkmCustEmrgncCntctObj();

        this.listFamily = new Array<LtkmCustObj>();
        this.RowVersion = ""; 
    }
}
