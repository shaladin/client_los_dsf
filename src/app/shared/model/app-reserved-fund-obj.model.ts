export class AppReservedFundObj {
  AppReservedFundId: number;
  AppId: number;
  MrReservedFundSourceCode: string;
  MrReservedFundCode: string;
  ReservedFundAmt: number;
  StdReservedFundAmt: number;
  Behaviour: string;
  RefundAmt: number;
  RowVersion: string;
  MrReservedFundSourceName: string;

  constructor() {
    this.AppReservedFundId = 0;
    this.AppId = 0;
    this.MrReservedFundSourceCode = "";
    this.MrReservedFundCode = "";
    this.ReservedFundAmt = 0;
    this.StdReservedFundAmt = 0;
    this.Behaviour = "";
    this.RowVersion = "";
    this.MrReservedFundSourceName = "";
  }
}
