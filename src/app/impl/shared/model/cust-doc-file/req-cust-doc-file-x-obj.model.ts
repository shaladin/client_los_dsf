import { CustDocFileXObj } from "./cust-doc-file-x-obj.model";

export class ReqCustDocFileXObj {
    CustId: number;
    CustDocFileObjs: Array<CustDocFileXObj>;
    constructor() {
        this.CustId = 0;
        this.CustDocFileObjs = new Array<CustDocFileXObj>();
    }
}