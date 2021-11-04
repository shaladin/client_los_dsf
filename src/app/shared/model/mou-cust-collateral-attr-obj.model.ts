export class MouCustCollateralAttrObj {
    CollateralAttrCode: string;
    CollateralAttrName: string;
    AttrInputType: string;
    AttrQuestionValue: Array<string>;
    PatternCode: string;
    PatternValue: string;
    RefAttrValue: string;
    AttrValue: string;
    AttrGroup: string;
    AttrLength: number;
    IsMandatory: boolean;
    constructor() {
        this.AttrQuestionValue = new Array();
        this.AttrValue = "";
    }
}

export class ResMouCustCollateralAttrObj {
    MouCustCollateralAttrObjs: Array<MouCustCollateralAttrObj>;
    IsDiffWithRefAttr: boolean;
    constructor() {
        this.MouCustCollateralAttrObjs = new Array();
    }
}