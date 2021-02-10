

export class AppAssetInsFeeOplObj {
  AppAssetInsOplId: number;
  MrInsFeeTypeCode: string;
  FeeAmt: number;
  RowVersion: string;
  CustFeeAmt: number;
  constructor() {
    this.AppAssetInsOplId = 0;
    this.MrInsFeeTypeCode = "";
    this.FeeAmt = 0;
    this.RowVersion = "";
    this.CustFeeAmt = 0;
  }
}
