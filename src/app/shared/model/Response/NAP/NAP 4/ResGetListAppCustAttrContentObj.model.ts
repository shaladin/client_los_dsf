export class ResGetListAppCustAttrContentObj {
    ResponseAppCustAttrContentObjs : Array<ResGetAppCustAttrContentObj>;

    constructor(){
        this.ResponseAppCustAttrContentObjs = new Array<ResGetAppCustAttrContentObj>();
    }
}

export class ResGetAppCustAttrContentObj {
    AttrCode : string;
    AttrName : string;
    AttrValue : string;
    MasterCode : string;
    Descr : string;

    constructor(){
        this.AttrCode = "";
        this.AttrName = "";
        this.AttrValue = "";
        this.MasterCode = "";
        this.Descr = "";
    }
}