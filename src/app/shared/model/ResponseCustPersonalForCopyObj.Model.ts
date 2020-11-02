import { CustObj } from "./CustObj.Model";
import { CustPersonalObj } from "./CustPersonalObj.Model";
import { CustAddrObj } from "./CustAddrObj.Model";

export class ResponseCustPersonalForCopyObj {
    CustObj: CustObj;
    CustPersonalObj: CustPersonalObj;
    CustAddrLegalObj : CustAddrObj;

    constructor()
    {
        this.CustObj = new CustObj();
        this.CustPersonalObj = new CustPersonalObj();
        this.CustAddrLegalObj  = new CustAddrObj ()
    }
}