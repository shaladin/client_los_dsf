export class AppCollateralAccessoryObj {
  AppCollateralAccessoryId: number;
  AppCollateralId: number;
  CollateralAccessoryCode: string;
  CollateralAccessoryName: string;
  AccessoryPriceAmt: number;
  DownPaymentAmt: number;
  AccessoryNotes: string;
  RowVersion: string;

  constructor() {
    this.AppCollateralAccessoryId = 0;
    this.AppCollateralId = 0;
    this.CollateralAccessoryCode = "";
    this.CollateralAccessoryName = "";
    this.AccessoryPriceAmt = 0;
    this.DownPaymentAmt = 0;
    this.AccessoryNotes = "";
    this.RowVersion = "";
  }
}
