export class ReqGetListAppCustAttrContentObj {
    AppCustId: number;
    AttrGroup: string;
    AttrCodes: Array<string>;

    constructor() {
        this.AttrCodes = new Array();
    }
}
export class ReqGetListAppCustAttr2ContentObj {
    AppCustId: number;
    AttrGroups: Array<string>;

    constructor() {
        this.AttrGroups = new Array();
    }
}