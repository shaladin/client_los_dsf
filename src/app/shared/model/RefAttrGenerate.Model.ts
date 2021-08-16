import { KeyValueObj } from "./KeyValue/KeyValueObj.model";

export class RefAttrGenerateObj {
    AttrCode: string;
    AttrName: string;
    AttrLength: number;
    AttrTypeCode: string;
    AttrInputType: string;
    AttrValue: string;
    AttrGroup: string;
    RsvField1: string;
    RsvField2: string;
    RsvField3: string;
    RsvField4: string;
    RsvField5: string;
    AttrQuestionValue: Array<KeyValueObj>;
    PatternCode: string;
    PatternValue: string;
    IsMandatory: boolean;
    MasterTypeCode: string;

    constructor() {
        this.AttrCode = "";
        this.AttrName = "";
        this.AttrLength = 0;
        this.AttrTypeCode = "";
        this.AttrInputType = "";
        this.AttrValue = "";
        this.AttrGroup = "";
        this.RsvField1 = "";
        this.RsvField2 = "";
        this.RsvField3 = "";
        this.RsvField4 = "";
        this.RsvField5 = "";
        this.PatternCode = "";
        this.PatternValue = "";
        this.AttrQuestionValue = new Array();
        this.IsMandatory = false;
        this.MasterTypeCode = "";
    }
}