export class NewCustAttrContentObj {
    CustAttrContentId: number;
    CustId: number;
    AttrValue: string;
    AttrCode: string;
    AttrName: string;
    AttrLength: number;
    AttrInputType: string;
    PatternCode: string;
    PatternValue: string;
    RefAttrId: number;
    IsMandatory: boolean;
    DefaultValue: string;
    MasterCode: string;
    Descr: string;
    AttrGroup: string;

constructor() { 
        this.CustAttrContentId = 0; 
        this.CustId = 0;
        this.AttrValue = "";
        this.AttrCode = "";
        this.AttrLength = 0;
        this.AttrInputType = "";
        this.PatternCode = "";
        this.PatternValue = "";
        this.RefAttrId = 0;
        this.IsMandatory = false;
        this.DefaultValue = "";
        this.MasterCode = "";
        this.Descr = "";
        this.AttrGroup = "";
    }
}
