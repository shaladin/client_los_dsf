export class ReqGetListAppCustAttrContentObj {
    AppCustId: number;
    AttrGroup: string;
    AttrCodes: Array<string>;

    constructor() {
        this.AttrCodes = new Array();
    }
}