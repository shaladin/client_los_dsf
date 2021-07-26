export class AppAssetAttrObj {
  AppAssetId: number;
  AppAssetAttrId: number;
  AssetAttrCode: string;
  AssetAttrName: string;
  AttrValue: string;
  AttrCode: string;
  AttrName: string;
  AttrInputType: string;
  AttrQuestionValue: Array<string>;
  AttrLength: number;

  constructor() {
    this.AssetAttrCode = "";
    this.AssetAttrName = "";
    this.AttrValue = "";
    this.AppAssetAttrId = 0;
    this.AppAssetId = 0;
  }
}
