

export class AppAssetFeeOplObj {
  AppAssetId: number;
  MrFeeTypeOplCode: string;
  FeeAmt: number;
  VatAmt: number;
  CapitalizedAmt: number;
  RowVersion: string;
  FeeBehaviourCode: string;
  FeeCapBehaviourCode: string;
  constructor() {
    this.AppAssetId = 0;
    this.MrFeeTypeOplCode = "";
    this.FeeAmt = 0;
    this.VatAmt = 0;
    this.CapitalizedAmt = 0;
    this.RowVersion = "";
    this.FeeBehaviourCode = "";
    this.FeeCapBehaviourCode = "";
  }
}
