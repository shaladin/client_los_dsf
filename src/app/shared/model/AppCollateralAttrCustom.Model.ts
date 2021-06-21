export class AppCollateralAttrCustomObj {
  CollateralAttrCode: string;
  CollateralAttrName: string;
  AttrValue: string;
  AttrCode: string;
  AttrName: string;
  AttrLength: number;
  AttrTypeCode: string;
  AttrInputType: string;
  AttrQuestionValue: Array<string>;
  AttrGroup: string;
  RsvField1: string;
  RsvField2: string;
  RsvField3: string;
  RsvField4: string;
  RsvField5: string;
  RowVersion: string;

  constructor() {
    this.CollateralAttrCode = "";
    this.CollateralAttrName = "";
    this.AttrValue = "";
    this.AttrCode = "";
    this.AttrLength = 0;
    this.AttrTypeCode = "";
    this.AttrInputType = "";
    this.AttrGroup = "";
    this.RsvField1 = "";
    this.RsvField2 = "";
    this.RsvField3 = "";
    this.RsvField4 = "";
    this.RsvField5 = "";
    this.RowVersion = "";
  }
}
