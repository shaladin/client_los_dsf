export class GenerateAppAttrContentObj {
    AppAttrContentId: number;
    AppId: number;
    RefAttrCode: string;
    RefAttrName: string;
    AttrValue: string;
    AttrInputType: string;
    AttrQuestionValue: Array<string>;
    AttrLength: number;
    AttrTypeCode: string;
    AttrGroup: string;
    PatternCode: string;
    PatternValue: string; 
    IsSystem: boolean;
    IsActive: boolean;
    RsvField1: string;
    RsvField2: string; 
    RsvField3: string; 
    RsvField4: string; 
    RsvField5: string;
    IsMandatory: boolean;
    RefAttrValue: string;
    constructor() {
      this.AppAttrContentId = 0;
      this.AppId = 0;
      this.RefAttrCode = "";
      this.RefAttrName = "";
      this.AttrValue = "";
      this.AttrInputType = "";
      this.AttrQuestionValue = new Array<string>();
      this.AttrLength = 0;
      this.AttrTypeCode = "";
      this.AttrGroup = "";
      this.PatternCode = "";
      this.PatternValue = ""; 
      this.IsSystem = false;
      this.IsActive = false;
      this.RsvField1 = "";
      this.RsvField2 = ""; 
      this.RsvField3 = ""; 
      this.RsvField4 = ""; 
      this.RsvField5 = "";
      this.IsMandatory = false;
      this.RefAttrValue = "";
    }
  }