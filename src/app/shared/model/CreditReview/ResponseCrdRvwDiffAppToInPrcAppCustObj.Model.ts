import { CrdRvwDiffAppToInPrcAppCustObj } from "./CrdRvwDiffAppToInPrcAppCustObj.Model";

export class ResponseCrdRvwDiffAppToInPrcAppCustObj {

    ListCrdRvwDiffAppToInPrcAppCustObj: Array<CrdRvwDiffAppToInPrcAppCustObj> = new Array<CrdRvwDiffAppToInPrcAppCustObj>();
    ListAppNo: Array<string> = new Array<string>();
    ListDiffTypeCustData: Array<string> = new Array<string>();
    DictDiffValue: { [AppNo_DiffType: string]: CrdRvwDiffAppToInPrcAppCustObj } = {};
    DictDiffAppNoIndicator: { [AppNo: string]: boolean } = {};
    constructor() { }
}