import { CustDataCompanyObj } from "./cust-data-company-obj.model";
import { CustDataPersonalObj } from "./cust-data-personal-obj.model";

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
