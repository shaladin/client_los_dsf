

export class AppAssetInsFeeOplObj {
  AppAssetInsOplId: number;
  MrInsFeeTypeCode: string;
  FeeAmt: number;
  RowVersion: string;

  constructor() {
    this.AppAssetInsOplId = 0;
    this.MrInsFeeTypeCode = "";
    this.FeeAmt = 0;
    this.RowVersion = "";
  }
}
