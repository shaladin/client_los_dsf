import { CustObj } from "./CustObj.Model";
import { CustCompanyObj } from "./CustCompanyObj.Model";
import { CustAddrObj } from "./CustAddrObj.Model";

export class ResponseCustCompanyForCopyObj {
    CustObj: CustObj;
    CustCompanyObj: CustCompanyObj;
    CustAddrLegalObj : CustAddrObj;

    constructor()
    {
        this.CustObj = new CustObj();
        this.CustCompanyObj = new CustCompanyObj();
        this.CustAddrLegalObj  = new CustAddrObj ()
    }
}