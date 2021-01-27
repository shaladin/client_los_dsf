import { CustDataCompanyObj } from "./CustDataCompanyObj.Model";
import { CustDataPersonalObj } from "./CustDataPersonalObj.Model";

export class CustObjForAddTrxData {
    RequestCustDataCompanyObj : CustDataCompanyObj;
    RequestCustDataPersonalObj : CustDataPersonalObj;
    AppId : number;
    MrCustTypeCode : string;
    constructor() { 
        this.RequestCustDataCompanyObj = new CustDataCompanyObj();
        this.RequestCustDataPersonalObj = new CustDataPersonalObj();
        this.AppId = 0;
        this.MrCustTypeCode = "";
    }
}
