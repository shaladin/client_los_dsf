export class ReqAppReservedFundXObj {
    AppId: number;
    MrReservedFundSourceCode: string;
    MrReservedFundCode: string;
    ReservedFundAmt: number;
    StdReservedFundAmt: number;
    Behaviour: string;
    RefundAmt: number;
  
    constructor() {
      this.AppId = 0;
      this.MrReservedFundSourceCode = "";
      this.MrReservedFundCode = "";
      this.ReservedFundAmt = 0;
      this.StdReservedFundAmt = 0;
      this.Behaviour = "";
      this.RefundAmt = 0;
    }
  }
  