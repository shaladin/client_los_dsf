export class AppAssetAttrObj {
  AppAssetId: number;
  AppAssetAttrId: number;
  AssetAttrCode: string;
  AssetAttrName: string;
  AttrValue: string;

  constructor() {
    this.AssetAttrCode = "";
    this.AssetAttrName = "";
    this.AttrValue = "";
    this.AppAssetAttrId = 0;
    this.AppAssetId = 0;
  }
}
